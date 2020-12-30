"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_schema_to_typescript_1 = require("json-schema-to-typescript");
const chalk = require("chalk");
const camelcase_1 = require("camelcase");
const axios_1 = require("axios");
const dict_1 = require("../dict");
const fs = require('fs-extra');
const ora = require('ora');
const path = require('path');
const isValidConfig = (config) => {
    const { url, projectId, token } = config;
    if (!url) {
        console.log(chalk.red(`url is required!`));
        return false;
    }
    if (!projectId) {
        console.log(chalk.red(`projectId is required!`));
        return false;
    }
    if (!token) {
        console.log(chalk.red(`token is required!`));
        return false;
    }
    return true;
};
const defaultAtiConfigs = {
    output: 'atiOutput'
};
const getAtiConfigs = () => {
    const cwd = process.cwd();
    const userAtiConfig = require(`${cwd}/ati.config.js`) || {};
    const atiConfigs = Object.assign({}, defaultAtiConfigs, userAtiConfig);
    return atiConfigs;
};
const initRequest = (atiConfigs) => {
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
        var _a, _b;
        if ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.errmsg) {
            console.error((_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.errmsg);
        }
        return response;
    });
    return request;
};
function default_1() {
    const atiConfigs = getAtiConfigs();
    if (!isValidConfig(atiConfigs)) {
        return;
    }
    const request = initRequest(atiConfigs);
    const generateInterface = async (item) => {
        await request({
            url: dict_1.YapiUrls.apiInfo,
            params: {
                id: item.id
            }
        }).then(resp => {
            var _a, _b, _c;
            const respData = (_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.data;
            if (respData) {
                try {
                    const paths = (_b = respData === null || respData === void 0 ? void 0 : respData.path) === null || _b === void 0 ? void 0 : _b.split('/');
                    const name = paths[paths.length - 1];
                    const apiData = JSON.parse(respData.res_body);
                    json_schema_to_typescript_1.compile((_c = apiData === null || apiData === void 0 ? void 0 : apiData.properties) === null || _c === void 0 ? void 0 : _c.data, camelcase_1.default(name))
                        .then(ts => {
                        const outputRootPath = path.resolve(process.cwd(), `${atiConfigs.output}`);
                        if (!fs.existsSync(outputRootPath)) {
                            fs.mkdirSync(outputRootPath);
                        }
                        const filePath = path.resolve(outputRootPath, `${paths[paths.length - 2]}`);
                        if (!fs.existsSync(filePath)) {
                            fs.mkdirSync(filePath);
                        }
                        fs.writeFileSync(`${filePath}/${name}.d.ts`, ts, { encoding: 'utf8' });
                    });
                }
                catch (err) {
                    console.error(err);
                }
            }
        });
    };
    const spinner = ora('Loading unicorns').start();
    request({
        url: dict_1.YapiUrls.listCat,
        params: { page: 1, limit: 50, catid: 10403 }
    })
        .then(resp => {
        const apiList = resp.data.data.list.map(item => {
            return {
                path: item.path,
                id: item._id
            };
        });
        apiList.forEach(generateInterface);
        spinner.stop();
    });
}
exports.default = default_1;
