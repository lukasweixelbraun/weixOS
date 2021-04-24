import React from 'react'
import ReactDOM from 'react-dom'

const App = props => (
  <div class="app">

  </div>
)

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    // JETZT IST DOM FULLY LOADED
    <App />, document.getElementById('screen')
  )
})