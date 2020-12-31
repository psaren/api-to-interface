"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Generator_1 = require("./Generator");
const axios_1 = require("axios");
const utils_1 = require("../utils");
const dict_1 = require("../dict");
const camelcase_1 = require("camelcase");
const json_schema_to_typescript_1 = require("json-schema-to-typescript");
const fs = require('fs-extra');
const ora = require('ora');
const path = require('path');
const consola = require('consola');
class YapiGenerator extends Generator_1.default {
    constructor() {
        super(utils_1.getAtiConfigs({ output: 'atiOutput' }));
        this.generateInterface = async (item) => {
            var _a, _b, _c, _d, _e, _f, _g;
            const resp = await this.request({
                url: dict_1.YapiUrls.apiInfo,
                params: {
                    id: item.id
                }
            });
            const respData = (_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.data;
            if (respData && (respData === null || respData === void 0 ? void 0 : respData.res_body_is_json_schema) && (respData === null || respData === void 0 ? void 0 : respData.res_body)) {
                try {
                    const paths = (_b = respData === null || respData === void 0 ? void 0 : respData.path) === null || _b === void 0 ? void 0 : _b.split('/');
                    const name = paths[paths.length - 1];
                    const resBody = JSON.parse(respData.res_body);
                    const resSchema = ((_c = resBody === null || resBody === void 0 ? void 0 : resBody.properties) === null || _c === void 0 ? void 0 : _c.data) || resBody;
                    if (respData.req_body_type === 'json' && respData.req_body_is_json_schema) {
                        const reqBody = JSON.parse(respData.req_body_other);
                        const reqSchema = ((_d = reqBody === null || reqBody === void 0 ? void 0 : reqBody.properties) === null || _d === void 0 ? void 0 : _d.data) || reqBody;
                        const tempName = (_g = (_f = (_e = respData === null || respData === void 0 ? void 0 : respData.path) === null || _e === void 0 ? void 0 : _e.split('/')) === null || _f === void 0 ? void 0 : _f.slice(-2)) === null || _g === void 0 ? void 0 : _g.join('-');
                        // If interface name is `title`, change the interface name
                        if (reqSchema.title === 'title') {
                            reqSchema.title = camelcase_1.default(tempName);
                        }
                        json_schema_to_typescript_1.compile(reqSchema, camelcase_1.default(tempName))
                            .then(ts => {
                            this.writeInterfaceToFile(ts, name, paths);
                        });
                    }
                    if (resSchema) {
                        json_schema_to_typescript_1.compile(resSchema, camelcase_1.default(name))
                            .then(ts => {
                            this.writeInterfaceToFile(ts, name, paths);
                        });
                    }
                    else {
                        consola.error(respData === null || respData === void 0 ? void 0 : respData.path);
                        consola.info(`ignore: ${respData.res_body}`);
                    }
                }
                catch (err) {
                    consola.error(err);
                    console.log(respData);
                }
            }
        };
        this.getGroupId = async () => {
            var _a, _b, _c, _d;
            if (!((_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.groupId) === null || _b === void 0 ? void 0 : _b.length)) {
                const resp = await this.request({
                    url: dict_1.YapiUrls.listMenu,
                    params: {
                        project_id: this.config.projectId
                    }
                });
                this.config.groupId = ((_d = (_c = resp === null || resp === void 0 ? void 0 : resp.data) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.map(item => item._id)) || [];
            }
        };
        this.generate = async () => {
            var _a;
            await this.getGroupId();
            (_a = this.config.groupId) === null || _a === void 0 ? void 0 : _a.forEach(async (catId) => {
                var _a, _b;
                const spinner = ora(`id: ${catId} 任务开始\n`).start();
                const resp = await this.request({
                    url: dict_1.YapiUrls.listCat,
                    params: { page: 1, limit: 50, catid: catId }
                });
                const list = ((_b = (_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.list) || [];
                const apiList = list.map(item => {
                    return {
                        path: item.path,
                        id: item._id
                    };
                });
                if (apiList.length) {
                    Promise.all(apiList.map(this.generateInterface))
                        .then(() => {
                        spinner.succeed(`id: ${catId} 任务完成`);
                    });
                }
                else {
                    spinner.stop();
                }
            });
        };
        this.initRequest();
    }
    initRequest() {
        const atiConfigs = this.config;
        const request = axios_1.default.create({
            baseURL: atiConfigs.url
        });
        request.interceptors.request.use((config) => {
            if (config.method === 'post') {
                config.data = Object.assign(config.data || {}, { token: atiConfigs.token });
            }
            else {
                config.params = Object.assign(config.params || {}, { token: atiConfigs.token });
            }
            return config;
        });
        request.interceptors.response.use((response) => {
            var _a, _b, _c;
            if (((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.errcode) && ((_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.errmsg)) {
                consola.error((_c = response === null || response === void 0 ? void 0 : response.data) === null || _c === void 0 ? void 0 : _c.errmsg);
            }
            return response;
        });
        this.request = request;
        return this.request;
    }
    checkConfig() {
        const { url, projectId, token } = this.config;
        if (!url) {
            consola.error('url is required!');
            return false;
        }
        if (!projectId) {
            consola.error('projectId is required!');
            return false;
        }
        if (!token) {
            consola.error('token is required!');
            return false;
        }
        return true;
    }
    writeInterfaceToFile(content, name, paths) {
        const outputRootPath = path.resolve(process.cwd(), `${this.config.output}`);
        if (!fs.existsSync(outputRootPath)) {
            fs.mkdirSync(outputRootPath);
        }
        const fileDirPath = path.resolve(outputRootPath, `${paths[paths.length - 2]}`);
        if (!fs.existsSync(fileDirPath)) {
            fs.mkdirSync(fileDirPath);
        }
        const filePath = `${fileDirPath}/${name}.d.ts`;
        let newContent = content;
        if (fs.existsSync(filePath)) {
            newContent = fs.readFileSync(filePath, { encoding: 'utf8' }) + `\n${content}`;
        }
        fs.writeFileSync(filePath, newContent, { encoding: 'utf8' });
    }
}
exports.default = YapiGenerator;
