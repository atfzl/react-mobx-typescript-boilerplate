import * as React from 'react';

import { ITodoActions, TodoItem } from 'components/TodoItem';
import { TodoModel } from 'models/TodoModel';

import * as style from './style.css';

export interface ITodoListProps extends ITodoActions {
  todos: TodoModel[];
  completeAll: () => any;
}

export class TodoList extends React.Component<ITodoListProps, any> {
  constructor(props?: ITodoListProps, context?: any) {
    super(props, context);
    this.handleToggleAll = this.handleToggleAll.bind(this);
  }

  private handleToggleAll(e: React.SyntheticEvent<any>) {
    e.preventDefault();
    this.props.completeAll();
  }

  private renderToggleAll() {
    const { todos } = this.props;
    const completedCount = todos.length;
    if (todos.length > 0) {
      return (
        <input
          className={style.toggleAll}
          type="checkbox"
          checked={completedCount === todos.length}
          onChange={this.handleToggleAll}
        />
      );
    }
  }

  public render() {
    const { todos, ...actions } = this.props;
    return (
      <section className={style.main}>
        {this.renderToggleAll()}
        <ul className={style.normal}>
          {todos.map(todo =>
            <TodoItem key={todo.id} todo={todo} {...actions} />,
          )}
        </ul>
      </section>
    );
  }
}

export default TodoList;
