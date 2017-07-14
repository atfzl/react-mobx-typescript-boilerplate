import { action, computed, observable } from 'mobx';
import { TodoModel } from 'models';

export class TodoStore {
  constructor(fixtures: TodoModel[]) {
    this.todos = fixtures;
    this.addTodo = this.addTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.editTodo = this.editTodo.bind(this);
    this.completeAll = this.completeAll.bind(this);
    this.clearCompleted = this.clearCompleted.bind(this);
  }

  @observable public todos: TodoModel[];

  @computed
  get activeTodos() {
    return this.todos.filter(todo => !todo.completed);
  }

  @computed
  get completedTodos() {
    return this.todos.filter(todo => todo.completed);
  }

  @action
  public addTodo(item: Partial<TodoModel>): void {
    this.todos.push(new TodoModel(item.text, item.completed));
  }

  @action
  public editTodo(id: number, data: Partial<TodoModel>): void {
    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        if (typeof data.completed === 'boolean') {
          todo.completed = data.completed;
        }
        if (typeof data.text === 'string') {
          todo.text = data.text;
        }
      }
      return todo;
    });
  }

  @action
  public deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  @action
  public completeAll(): void {
    this.todos = this.todos.map(todo => ({ ...todo, completed: true }));
  }

  @action
  public clearCompleted(): void {
    this.todos = this.todos.filter(todo => !todo.completed);
  }
}

export default TodoStore;
