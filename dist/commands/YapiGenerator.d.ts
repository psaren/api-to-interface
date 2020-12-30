import Generator from './Generator';
import { AxiosInstance } from 'axios';
interface YapiConfig {
    url: string;
    projectId: string;
    token: string;
    output?: string;
    groupId?: string[];
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
    generateInterface: (item: ApiItem) => Promise<void>;
    getGroupId: () => Promise<void>;
    generate: () => Promise<void>;
}
export default YapiGenerator;
