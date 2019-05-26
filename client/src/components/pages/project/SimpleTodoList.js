import React, { Component } from "react";
import Flip from "./Flip";
import "./simpleTask.css";

class SimpleTodoList extends Component {
  constructor(props) {
    super(props);
    this.flip = new Flip();
    this.currentId = 0;
    this.state = { text: "" };
    this.handleTyping = this.handleTyping.bind(this);
    this.addSimpleTask = this.addSimpleTask.bind(this);
    this.changeTaskState = this.changeTaskState.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  handleTyping(e) {
    this.setState({ text: e.target.value });
  }

  componentDidMount() {
    let tasks = document.getElementsByClassName("simple-todo-task");
    if (tasks) {
      this.flip.read(tasks);
    }
  }

  componentDidUpdate() {
    let tasks = document.getElementsByClassName("simple-todo-task");
    if (tasks) {
      this.flip.animateMove();
      window.setTimeout(() => this.flip.read(tasks), 250);
    }
  }

  addSimpleTask(e) {
    e.preventDefault();
    let nTask = {
      description: this.state.text,
      id_task: this.props.taskId,
      state: 0,
    };
    fetch("/api/task/addSimple", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nTask),
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "OK") {
          nTask.id_simple_task = data.id_simple_task;
          let nList = [...this.props.list, nTask];
          this.props.fallback({ simpleTasks: nList });
          this.props.editTask({
            id_task: this.props.taskId,
            simpleTasks: nList,
          });
        }
      });
  }

  changeTaskState(e, task) {
    e.preventDefault();
    let nTask = Object.assign(
      {},
      this.props.list.find(elm => elm.id_simple_task === task.id_simple_task)
    );
    fetch(`/api/task/${task.id_simple_task}/changeSimple`, { method: "GET" })
      .then(res => res.json())
      .then(data => {
        if (data.status === "OK") {
          nTask.state = (nTask.state + 1) % 2;
          let nList = [
            ...this.props.list.filter(
              elm => elm.id_simple_task !== nTask.id_simple_task
            ),
            nTask,
          ];
          this.props.fallback({ simpleTasks: nList });
          this.props.editTask({
            id_task: this.props.taskId,
            simpleTasks: nList,
          });
        }
      });
  }

  deleteTask(e, task) {
    e.preventDefault();
    e.stopPropagation();
    fetch(`/api/task/${task.id_simple_task}/removeSimple`, { method: "GET" })
      .then(res => res.json())
      .then(data => {
        if (data.status === "OK") {
          let nList = this.props.list.filter(
            elm => elm.id_simple_task !== task.id_simple_task
          );
          this.props.fallback({ simpleTasks: nList });
          this.props.editTask({
            id_task: this.props.taskId,
            simpleTasks: nList,
          });
        }
      });
  }

  render() {
    let that = this;
    const Task = function(task, bg) {
      let key = task.id_simple_task + "SimpleTodoTask";
      return (
        <div
          id={key}
          key={key}
          style={{ borderRadius: "5px" }}
          className={`simple-todo-task text-light mb-2 pt-1 pb-1 ${bg} text-center`}
          onClick={e => that.changeTaskState(e, task)}>
          <div>
            {task.description}
            <span
              className="simple-task-del"
              onClick={e => that.deleteTask(e, task)}>
              &times;
            </span>
          </div>
        </div>
      );
    };

    return (
      <div className="">
        <form className="input-group">
          <input
            type="text"
            value={this.state.text}
            onChange={this.handleTyping}
            className="form-control form-group form-control-lg"
            placeholder="Nom de la tâche"
          />
          <button
            className="btn btn-success input-group-append"
            onClick={this.addSimpleTask}>
            +
          </button>
        </form>
        <div className="d-flex justify-content-around">
          <div style={{ width: "49%" }}>
            <h4 className="text-center">A faire</h4>
            {this.props.list
              .filter(task => task.state === 0)
              .map(task => {
                return Task(task, "bg-danger");
              })}
          </div>
          <div style={{ width: "49%" }}>
            <h4 className="text-center">Fait</h4>
            {this.props.list
              .filter(task => task.state === 1)
              .map(task => {
                return Task(task, "bg-success");
              })}
          </div>
        </div>
      </div>
    );
  }
}

export default SimpleTodoList;
