import * as React from 'react';
import { Route, Switch } from 'react-router';
import { asyncComponent } from 'react-async-component';

import TodoApp from 'containers/TodoApp';

const Error = asyncComponent({
  resolve: () => import(/* webpackChunkName: "Error" */ 'components/Error'),
});

const Routes = () =>
  <Switch>
    <Route exact path="/" component={TodoApp} />
    <Route component={Error} />
  </Switch>;

export default Routes;
