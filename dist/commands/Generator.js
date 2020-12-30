"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Generator {
    constructor(config) {
        this.config = config;
    }
    run() {
        if (!this.checkConfig()) {
            return;
        }
        this.generate();
    }
}
exports.default = Generator;
