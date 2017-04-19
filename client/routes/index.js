import React from 'react'
import ReactRouter, { Router, Route, IndexRoute, browserHistory } from 'react-router'
import Main from '../components/Main';
import Home from '../components/Home';

const routes = (
  <Router history={browserHistory}>
    <Route component={Main}>
      <Route path='/(:roomID)' component={Home}>
      </Route>
    </Route>
  </Router>
);

export default routes;
