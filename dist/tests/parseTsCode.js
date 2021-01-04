"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const code = `export interface IpoBatchOrder {
  /**
   * IPO股票号码
   */
  productCode: string;
  /**
   * 市场
   */
  exchangeCode: string;
  /**
   * 下单详情
   */
  list: {
    /**
     * 用户ID
     */
    userId: string;
    /**
     * 认购手数
     */
    hands: string;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}`;
const result = utils_1.parseTsCode(code, utils_1.removeIndexSignatureMiddleWare);
console.log('result', result);
