class Http {
  constructor() {
    this.xhr = new XMLHttpRequest()
    this.requestFunction = (REST, url, header = {}, body = null) =>
      new Promise((resolve, reject) => {
        this.xhr.open(REST, url)

        const keys = Object.keys(header)
        const values = Object.values(header)

        keys.forEach((_data, index) => {
          this.xhr.setRequestHeader(_data, values[index])
        })

        this.xhr.setRequestHeader('Content-Type', 'application/json')

        this.xhr.onreadystatechange = () => {
          try {
            if (this.xhr.readyState === this.xhr.DONE) {
              resolve({
                status: this.xhr.status,
                data: JSON.parse(this.xhr.responseText)
              })
            }
          } catch (error) {
            reject({
              status: this.xhr.status,
              text: error.description
            })
          }
        }

        this.xhr.send(!!body ? JSON.stringify(body) : null)
      })
  }

  get(url, header = {}) {
    return this.requestFunction('GET', url, header)
  }

  post(url, data, header = {}) {
    return this.requestFunction('POST', url, data, header)
  }

  delete(url, header) {
    return this.requestFunction('DELETE', url, header)
  }

  patch(url, data, header) {
    return this.requestFunction('PATCH', url, data, header)
  }

  put(url, data, header) {
    return this.requestFunction('PUT', url, data, header)
  }
}

module.exports = Http
