import Generator from './Generator'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { getAtiConfigs } from '../utils'
import { YapiUrls } from '../dict'
import camelCase from 'camelcase'
import { compile } from 'json-schema-to-typescript'

const fs = require('fs-extra')
const ora = require('ora')
const path = require('path')
const consola = require('consola')

interface YapiConfig {
  url: string
  projectId: string
  token: string
  output?: string
  groupId?: string[]
}

export type ApiItem = { path: string, id: number }

class YapiGenerator extends Generator<YapiConfig> {
  request: AxiosInstance

  constructor () {
    super(getAtiConfigs({ output: 'atiOutput' }))
    this.initRequest()
  }

  public initRequest() {
    const atiConfigs = this.config
    const request = axios.create({
      baseURL: atiConfigs.url
    })
    request.interceptors.request.use((config) => {
      if (config.method === 'post') {
        config.data = Object.assign(config.data || {}, { token: atiConfigs.token })
      } else {
        config.params = Object.assign(config.params || {}, { token: atiConfigs.token })
      }
      return config
    })
    request.interceptors.response.use((response: AxiosResponse<{errmsg: string, errcode: number}>) => {
      if (response?.data?.errcode && response?.data?.errmsg) {
        consola.error(response?.data?.errmsg)
      }
      return response
    })
    this.request = request
    return this.request
  }

  public checkConfig() {
    const { url, projectId, token } = this.config
    if (!url) {
      consola.error(`url is required!`)
      return false
    }
    if (!projectId) {
      consola.error(`projectId is required!`)
      return false
    }
    if (!token) {
      consola.error(`token is required!`)
      return false
    }
    return true
  }

  generateInterface = async (item: ApiItem) => {
    const resp = await this.request({
      url: YapiUrls.apiInfo,
      params: {
        id: item.id
      }
    })
    const respData = resp?.data?.data
    if (respData && respData?.res_body_is_json_schema && respData?.res_body) {
      try {
        const paths = respData?.path?.split('/')
        const name: string = paths[paths.length-1]
        const apiData = JSON.parse(respData.res_body)
        const schema = apiData?.properties?.data || apiData
        if (schema) {
          compile(schema, camelCase(name))
          .then(ts => {
            const outputRootPath = path.resolve(process.cwd(), `${this.config.output}`)
            if (!fs.existsSync(outputRootPath)) {
              fs.mkdirSync(outputRootPath)
            }
            const filePath = path.resolve(outputRootPath, `${paths[paths.length-2]}`)
            if (!fs.existsSync(filePath)) {
              fs.mkdirSync(filePath)
            }
            fs.writeFileSync(`${filePath}/${name}.d.ts`, ts, { encoding: 'utf8' })
          })
        } else {
          consola.error(respData?.path)
          consola.info(`ignore: ${respData.res_body}`)
        }
        
      } catch(err) {
        consola.error(err)
        console.log(respData)
      }
    }
  }

  getGroupId = async () => {
    if (!this.config?.groupId?.length) {
      const resp = await this.request({
        url: YapiUrls.listMenu,
        params: {
          project_id: this.config.projectId
        }
      })
      this.config.groupId = resp?.data?.data?.map(item => item._id) || []
    }
  }

  generate = async () => {
    await this.getGroupId()
    this.config.groupId?.forEach(async (catId) => {
      const spinner = ora(`id: ${catId} 任务开始\n`).start()
      const resp = await this.request({ 
        url: YapiUrls.listCat, 
        params: { page: 1, limit: 50, catid: catId} 
      })
      const list = resp?.data?.data?.list || []
      const apiList = list.map(item => {
        return {
          path: item.path,
          id: item._id
        }
      })
      
      if (apiList.length) {
        Promise.all(apiList.map(this.generateInterface))
        .then(() => {
          spinner.succeed(`id: ${catId} 任务完成`)
        })
      } else {
        spinner.stop()
      }
    })
    
  }

}

export default YapiGenerator
