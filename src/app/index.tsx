import { createBrowserHistory } from 'history';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, Router, Switch } from 'react-router';

import { STORE_ROUTER, STORE_TODO } from 'constants/stores';
import { TodoFilter } from 'constants/todos';
import { Root } from 'containers/Root';
import { TodoApp } from 'containers/TodoApp';
import { TodoModel } from 'models/TodoModel';
import { RouterStore, TodoStore } from 'stores';

// enable MobX strict mode
useStrict(true);

// default fixtures for TodoStore
const defaultTodos = [
  new TodoModel('Use Mobx'),
  new TodoModel('Use React', true),
];

// prepare MobX stores
const history = createBrowserHistory();
const todoStore = new TodoStore(defaultTodos);
const routerStore = new RouterStore(history);
const rootStores = {
  [STORE_TODO]: todoStore,
  [STORE_ROUTER]: routerStore,
};

// render react DOM
ReactDOM.render(
  <Provider {...rootStores} >
    <Root>
      <Router history={history} >
        <Switch>
          <Route path="/" component={TodoApp} />
        </Switch>
      </Router>
    </Root>
  </Provider >,
  document.getElementById('root'),
);
