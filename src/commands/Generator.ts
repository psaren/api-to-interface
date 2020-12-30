import { AxiosInstance } from 'axios'

abstract class Generator<T> {
  config: T
  constructor (config: T) {
    this.config = config
  }

  // this method should return an axios instance
  public abstract initRequest(): AxiosInstance
  // this method will check the config is valid or not
  public abstract checkConfig(): boolean

  public abstract generate(...args): void | Promise<void>

  public run () {
    if (!this.checkConfig()) {
      return
    }
    this.generate()
  }
}

export default Generator
