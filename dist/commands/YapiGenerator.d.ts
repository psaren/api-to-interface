import Generator from './Generator';
import { AxiosInstance } from 'axios';
import { Options } from 'json-schema-to-typescript';
declare type CustomInterfaceName = (name: string, type: string, response: any) => string;
interface YapiConfig {
    url: string;
    projectId: string;
    token: string;
    output?: string;
    groupId?: string[];
    json2TsOptions?: Partial<Options>;
    customInterfaceName?: CustomInterfaceName;
}
export declare type ApiItem = {
    path: string;
    id: number;
};
declare class YapiGenerator extends Generator<YapiConfig> {
    request: AxiosInstance;
    constructor();
    initRequest(): AxiosInstance;
    checkConfig(): boolean;
    writeInterfaceToFile(content: string, name: string, paths: string[]): void;
    customInterfaceName: (name: string, type: string, response: any) => string;
    generateInterface: (item: ApiItem) => Promise<void>;
    getGroupId: () => Promise<void>;
    generate: () => Promise<void>;
}
export default YapiGenerator;
