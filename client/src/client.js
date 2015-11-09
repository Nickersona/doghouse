import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink } from 'react-router'

import Home from './routes/home.js';

const ACTIVE = { color: 'red' }

class App extends React.Component {
  render() {
    return (
      <div>
        <h2>App</h2>
        	<ul>
				<li><IndexLink to="/"           activeStyle={ACTIVE}>Home</IndexLink></li>
				<li><IndexLink to="/about"      activeStyle={ACTIVE}>About</IndexLink></li>
        	</ul>
        	{this.props.children}
      </div>
    )
  }
}

class About extends React.Component {
  render() {
    return (
      <div>
        <h2>About</h2>
      </div>
    )
  }
}



class NoMatch extends React.Component {
  render() {
    return (
      <div>
        <h2>404 not found</h2>
      </div>
    )
  }
}


// Declarative route configuration (could also load this config lazily
// instead, all you really need is a single root route, you don't need to
// colocate the entire config).
render((
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="about" component={About}/>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.getElementById('app'))