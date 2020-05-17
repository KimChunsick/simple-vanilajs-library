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
