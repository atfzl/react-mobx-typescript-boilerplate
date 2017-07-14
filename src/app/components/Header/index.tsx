import * as React from 'react';

import { TodoTextInput } from 'components/TodoTextInput';
import { TodoModel } from 'models/TodoModel';

export interface IHeaderProps {
  addTodo: (todo: Partial<TodoModel>) => any;
}

export class Header extends React.Component<IHeaderProps, any> {

  constructor(props?: IHeaderProps, context?: any) {
    super(props, context);
    this.handleSave = this.handleSave.bind(this);
  }

  private handleSave(text: string) {
    if (text.length) {
      this.props.addTodo({ text });
    }
  }

  public render() {
    return (
      <header>
        <h1>Todos</h1>
        <TodoTextInput
          newTodo
          onSave={this.handleSave}
          placeholder="What needs to be done?" />
      </header>
    );
  }
}

export default Header;
