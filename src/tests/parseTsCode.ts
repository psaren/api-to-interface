import { parseTsCode, removeIndexSignatureMiddleWare } from '../utils'

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
}`

const result = parseTsCode(code, removeIndexSignatureMiddleWare)
console.log('result', result)
