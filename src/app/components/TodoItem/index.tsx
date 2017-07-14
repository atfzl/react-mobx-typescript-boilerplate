import * as classNames from 'classnames';
import * as React from 'react';

import { TodoTextInput } from 'components/TodoTextInput';
import { TodoModel } from 'models/TodoModel';

import * as style from './style.css';

export interface ITodoActions {
  editTodo: (id: number, data: Partial<TodoModel>) => any;
  deleteTodo: (id: number) => any;
}

export interface ITodoProps extends ITodoActions {
  todo: TodoModel;
}

export interface ITodoState {
  editing: boolean;
}

export class TodoItem extends React.Component<ITodoProps, ITodoState> {
  constructor(props?: ITodoProps, context?: any) {
    super(props, context);
    this.state = { editing: false };
    this.updateTodo = this.updateTodo.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleClickDeleteButton = this.handleClickDeleteButton.bind(this);
    this.handleToggleCheckbox = this.handleToggleCheckbox.bind(this);
  }

  private handleDoubleClick(e: React.SyntheticEvent<any>) {
    this.setState({ editing: true });
  }

  private handleToggleCheckbox(e: React.SyntheticEvent<any>) {
    const { todo } = this.props;
    const target = e.target as any;
    if (
      target &&
      target.checked !== undefined &&
      target.checked !== todo.completed
    ) {
      this.updateTodo({ completed: target.checked });
    }
  }

  private handleClickDeleteButton(e: React.SyntheticEvent<any>) {
    const { todo, deleteTodo } = this.props;
    deleteTodo(todo.id);
  }

  private updateTodo(data: Partial<TodoModel>) {
    const { todo } = this.props;
    if (data.text !== undefined && data.text.trim().length === 0) {
      this.props.deleteTodo(todo.id);
    } else {
      this.props.editTodo(todo.id, data);
    }
    this.setState({ editing: false });
  }

  public render() {
    const { todo, deleteTodo } = this.props;

    const element = this.state.editing
      ? <TodoTextInput
          text={todo.text}
          editing={this.state.editing}
          onSave={text => this.updateTodo({ text })}
        />
      : <div className={style.view}>
          <input
            className={style.toggle}
            type="checkbox"
            checked={todo.completed}
            onChange={this.handleToggleCheckbox}
          />

          <label onDoubleClick={this.handleDoubleClick}>
            {todo.text}
          </label>

          <button
            className={style.destroy}
            onClick={this.handleClickDeleteButton}
          />
        </div>;

    const classes = classNames({
      [style.completed]: todo.completed,
      [style.editing]: this.state.editing,
      [style.normal]: !this.state.editing,
    });

    return (
      <li className={classes}>
        {element}
      </li>
    );
  }
}

export default TodoItem;
