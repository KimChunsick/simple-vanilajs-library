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
