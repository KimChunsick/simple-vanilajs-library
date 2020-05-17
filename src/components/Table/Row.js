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
