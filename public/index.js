(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const DashBoard = require('./src/components/DashBoard')
const app = document.getElementById('app')
const dashboard = new DashBoard()
app.insertAdjacentHTML('afterbegin', dashboard.render())
dashboard.mount()

},{"./src/components/DashBoard":3}],2:[function(require,module,exports){
const Component = require('./common/component')

class DashBoard extends Component {
  constructor(callback) {
    super('Button')
    this.callback = callback
  }

  mount() {
    super.mount()
    this.ref.addEventListener('click', this.callback)
  }

  render(children = '') {
    return super.render(children, 'button')
  }
}

module.exports = DashBoard

},{"./common/component":6}],3:[function(require,module,exports){
const Component = require('../common/component')
const Table = require('../Table')
const Buton = require('../Button')
const Http = require('../../util/Http')

class DashBoard extends Component {
  constructor() {
    super('DashBoard')
    this.table = new Table()
    this.http = new Http()
    this.employees = []
    this.test = 1
    this.button = new Buton(() => {
      if (this.test % 2 === 0) {
        this.http.get('http://dummy.restapiexample.com/api/v1/employees').then((response) => {
          console.log(response)
          this.table.setStates({
            tableData: response.data.data
          })
        })
      } else {
        this.http.get('https://jsonplaceholder.typicode.com/todos/').then((response) => {
          console.log(response)
          this.table.setStates({
            tableData: response.data
          })
        })
      }
      this.test++
    })

    this.addChildren(this.table, this.button)
  }

  mount() {
    super.mount()
  }

  render() {
    return super.render(`
      ${this.button.render('API를 불러오는 신기한 버튼')}
      ${this.table.render()}
    `)
  }
}

module.exports = DashBoard

},{"../../util/Http":7,"../Button":2,"../Table":5,"../common/component":6}],4:[function(require,module,exports){
const Component = require('../common/component')

class Row extends Component {
  constructor(tag, data) {
    super('Row')
    this.tag = tag
    this.data = data
  }

  mount() {
    super.mount()
    this.ref.addEventListener('click', () => {
      alert(this.data)
    })
  }

  render() {
    return super.render(`${this.map(this.data, (data) => `<${this.tag}>${data}</${this.tag}>`)}`, 'tr')
  }
}

module.exports = Row

},{"../common/component":6}],5:[function(require,module,exports){
const Component = require('../common/component')
const Row = require('./Row')

class Table extends Component {
  constructor() {
    super('Table')
    // 자동 리렌더링이 필요하면 setstates, 아니면 그냥 this.~~
    this.setStates({
      tableData: [
        { name: 'a', price: 5000, time: '2019-05-18T17:00:00:00' },
        { name: 'b', price: 5000, time: '2019-05-18T17:00:00:00' },
        { name: 'c', price: 5000, time: '2019-05-18T17:00:00:00' },
        { name: 'd', price: 5000, time: '2019-05-18T17:00:00:00' },
        { name: 'e', price: 5000, time: '2019-05-18T17:00:00:00' }
      ]
    })
  }

  mount() {
    super.mount()
  }

  willChangeStates(states) {
    super.willChangeStates(states)
    this.redrawRow(states)
  }

  redrawRow(states) {
    this.removeChildAll()
    this.rows = [ new Row('th', Object.keys(states.tableData[0])) ]
    this.rows.push(...states.tableData.map((data) => new Row('td', Object.values(data))))
    this.addChildren(...this.rows)
  }

  render() {
    return super.render(`${this.rows.map((row) => row.render()).join('')}`, 'table')
  }
}

module.exports = Table

},{"../common/component":6,"./Row":4}],6:[function(require,module,exports){
class Component {
  constructor(name) {
    this.ref = null
    this.uniqueId = null
    this.states = {}
    this.children = []
    this.name = name
    this.uniqueId = Date.now() + Math.random().toString(16).slice(2)
  }

  mount() {
    this.ref = document.querySelectorAll(`[unique="${this.uniqueId}"]`)[0]
    if (!this.ref) console.log(this.name + '이 친구는 ref가 업따! 혹시 render를 한번이라도 했나요??')
    this.mountChildren()
  }

  setStates(states) {
    this.willChangeStates(states)
    this.states = { ...this.states, ...states }
    if (!!this.ref) {
      this.rerender()
      for (const child of this.children) {
        child.render()
      }
    }
    this.didChangedStates()
  }

  addChildren(...child) {
    this.children.push(...child)
  }

  removeChild(child) {
    this.children = this.children.filter((data) => {
      return data.uniqueId !== child.uniqueId
    })
  }

  removeChildAll() {
    this.children = []
  }

  map(targetArr, func) {
    return targetArr.map(func).toString().replace(/,/gi, '')
  }

  render(children, tag = 'div') {
    const element = document.createElement(tag)
    element.insertAdjacentHTML('afterbegin', children)
    element.setAttribute('unique', this.uniqueId)
    return element.outerHTML
  }

  rerender(children) {
    const target = this.ref
    target.innerHTML = null
    if (!!children) {
      target.insertAdjacentHTML('afterbegin', children)
    } else {
      target.insertAdjacentHTML('afterbegin', this.render())
    }
    this.mountChildren()
  }

  mountChildren() {
    for (const child of this.children) {
      child.mount()
    }
  }

  willChangeStates(states) {
    for (const child of this.children) {
      child.willChangeStates(states)
    }
  }

  didChangedStates() {
    for (const child of this.children) {
      child.didChangedStates()
    }
  }

  addEventListener(event, callback) {
    const target = this.ref
    if (!target) {
      console.log('이런 아이디는 없구나..', this.uniqueId)
      return
    }
    target.addEventListener(event, callback)
  }
}

module.exports = Component

},{}],7:[function(require,module,exports){
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

},{}]},{},[1]);
