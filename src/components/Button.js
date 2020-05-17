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
