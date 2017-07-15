import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as style from './style.css';

import Footer from 'components/Footer';
import Header from 'components/Header';
import TodoList from 'components/TodoList';
import { STORE_ROUTER, STORE_TODO } from 'constants/stores';
import { TODO_FILTER_LOCATION_HASH, TodoFilter } from 'constants/todos';
import { RouterStore, TodoStore } from 'stores';

type TodoAppProps = RouteComponentProps<any>;

interface ITodoAppState {
  filter?: TodoFilter;
}

@inject(STORE_TODO, STORE_ROUTER)
@observer
class TodoApp extends React.Component<TodoAppProps, ITodoAppState> {
  constructor(props: TodoAppProps, context: any) {
    super(props, context);
    this.state = { filter: TodoFilter.ALL };
    this.handleFilter = this.handleFilter.bind(this);
  }

  public componentWillMount() {
    this.checkLocationChange();
  }

  public componentWillReceiveProps() {
    this.checkLocationChange();
  }

  private checkLocationChange() {
    const router = this.props[STORE_ROUTER] as RouterStore;
    const filter = Object.keys(TODO_FILTER_LOCATION_HASH)
      .map(key => Number(key) as TodoFilter)
      .find(
        f =>
          TODO_FILTER_LOCATION_HASH[f] ===
          (router.location && router.location.hash),
      );
    this.setState({ filter });
  }

  private handleFilter(filter: TodoFilter) {
    const router = this.props[STORE_ROUTER] as RouterStore;
    const currentHash = router.location && router.location.hash;
    const nextHash = TODO_FILTER_LOCATION_HASH[filter];
    if (currentHash !== nextHash) {
      router.replace(nextHash);
    }
  }

  private getFilteredTodo(filter?: TodoFilter) {
    const todoStore = this.props[STORE_TODO] as TodoStore;
    switch (filter) {
      case TodoFilter.ACTIVE:
        return todoStore.activeTodos;
      case TodoFilter.COMPLETED:
        return todoStore.completedTodos;
      default:
        return todoStore.todos;
    }
  }

  public render() {
    const todoStore = this.props[STORE_TODO] as TodoStore;
    const { filter } = this.state;
    const filteredTodos = this.getFilteredTodo(filter);

    const footer = todoStore.todos.length
      ? <Footer
          filter={filter}
          activeCount={todoStore.activeTodos.length}
          completedCount={todoStore.completedTodos.length}
          onClearCompleted={todoStore.clearCompleted}
          onChangeFilter={this.handleFilter}
        />
      : undefined;

    return (
      <div className={style.normal}>
        <Header addTodo={todoStore.addTodo} />
        <TodoList
          todos={filteredTodos}
          completeAll={todoStore.completeAll}
          deleteTodo={todoStore.deleteTodo}
          editTodo={todoStore.editTodo}
        />
        {footer}
      </div>
    );
  }
}

export default TodoApp;
