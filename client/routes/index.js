import React from 'react'
import ReactRouter, { Router, Route, IndexRoute, browserHistory } from 'react-router'

// import {IndexRoute} from 'react-router';
// import {
//   BrowserRouter as Router,
//   Route,
//   Link,
//   HashRouter
// } from 'react-router-dom'

import Main from '../components/Main';
import Home from '../components/Home';
// const PromptContainer = require('../containers/PromptContainer');
// const ConfirmBattleContainer = require('../containers/ConfirmBattleContainer');

const routes = (
  <Router history={browserHistory}>
    <Route component={Main}>
      <Route path='/(:roomID)' component={Home}>
      </Route>
    </Route>
  </Router>
);


export default routes;
// <IndexRoute component={Home} />

// <Route path='playerOne' header='Player One' component={PromptContainer} />
// <Route path='playerTwo/:playerOne' header='Player Two' component={PromptContainer} />
// <Route path='battle' component={ConfirmBattleContainer} />
