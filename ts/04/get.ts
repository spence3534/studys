export namespace Request {
  export namespace Get {
    export function get(url: string): Promise<unknown> {
      return new Promise((resolve) => {
        resolve(`请求url为${url}`)
      })
    }
  }
}

export namespace Request {
  export namespace Post {
    export function post(url: string, data: Record<string, unknown>): Promise<unknown> {
      return new Promise((resolve) => {
        resolve(`请求url为${url}`)
      })
    }
  }
}