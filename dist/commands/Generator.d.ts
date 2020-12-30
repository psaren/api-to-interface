import { AxiosInstance } from 'axios';
declare abstract class Generator<T> {
    config: T;
    constructor(config: T);
    abstract initRequest(): AxiosInstance;
    abstract checkConfig(): boolean;
    abstract generate(...args: any[]): void | Promise<void>;
    run(): void;
}
export default Generator;
