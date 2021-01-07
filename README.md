# api-to-interface

将 yapi 接口数据转换为 typescript interface  

[![NPM version](https://img.shields.io/npm/v/api-to-interface.svg)](https://npmjs.org/package/api-to-interface)
[![NPM](https://img.shields.io/npm/l/api-to-interface)](./LECENSE)
![David](https://img.shields.io/david/psaren/api-to-interface)
[![npm](https://img.shields.io/npm/dm/api-to-interface)](https://www.npmjs.com/package/api-to-interface)

## install
``` 
npm i api-to-interface -g
```

## 初始化
```
ati init 
```
此命令将创建 ati.config.js 配置文件

``` js
// ati.config.js
module.exports = {
  // yapi 项目 url
  url: '',
  // 项目 id
  projectId: '',
  // yapi 项目 token
  token: '',
  // interface 输出目录
  output: '',
  // 项目内的分组 id
  groupId: [],
  // (可选) 自定义 interface name 
  customInterfaceName: (name, type) => {
    if (type === 'req') {
      return `${name}Req`
    } else {
      return `${name}Res`
    }
  }
}
```

## API signature
``` ts
type CustomInterfaceName = (name: string, type: string, response: any) => string

interface YapiConfig {
  url: string
  projectId: string
  token: string
  output?: string
  groupId?: string[]
  json2TsOptions?: Partial<Options>
  customInterfaceName?: CustomInterfaceName
}
```

## 生成 interface
```
ati run
```

## configs
| 属性                | 说明                 | 类型                | 默认值 |
| ------------------- | -------------------- | ------------------- | ------ |
| url                 | yapi 项目 url        | string              |        |
| projectId           | 项目 id              | string              |        |
| token               | yapi 项目 token      | string              |        |
| output              | interface 输出目录   | string              |        |
| groupId             | 项目内的分组 id      | string[]            |        |
| customInterfaceName | 自定义interface name | CustomInterfaceName |        |

> support customInterfaceName start at V1.0.6!