import { observable } from 'mobx';

class TodoModel {
  public readonly id: number;
  @observable public text?: string;
  @observable public completed: boolean;

  constructor(text?: string, completed: boolean = false) {
    this.id = TodoModel.generateId();
    this.text = text;
    this.completed = completed;
  }

  public static nextId = 1;
  public static generateId() {
    return this.nextId++;
  }
}

export default TodoModel;
