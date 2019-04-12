import { combineReducers } from "redux";
import {
  TOGGLE_NIGHT_MODE,
  EXIT_PROJECT_PAGE,
  CONFIG_PROJECT_PAGE,
  ADD_TASK,
  EDIT_TASK,
  REMOVE_TASK,
  ADD_COLLABORATOR,
  REMOVE_COLLABORATOR,
  CONFIG_EDIT_MODAL,
  CONFIG_ADD_MODAL,
} from "./actions";

let initialState = {
  tasksList: [],
  collaboratorsList: [],
  editModalDefaults: {},
  addModalDefaults: {},
};

function taskReducer(state = [], action) {
  switch (action.type) {
    case EXIT_PROJECT_PAGE:
      return [];
    case CONFIG_PROJECT_PAGE:
      return action.data.tasksList;
    case ADD_TASK:
      return [...state, action.taskInfo];
    case EDIT_TASK:
      let res = state.slice();
      for (let i = 0; i < res.length; i++) {
        if (res[i].id_task === action.taskInfo.id_task)
          res[i] = Object.assign({}, res[i], action.taskInfo);
      }
      return res;
    case REMOVE_TASK:
      return state.filter(task => task.id_task !== action.taskId);
    default:
      return state;
  }
}

function colReducer(state = [], action) {
  switch (action.type) {
    case EXIT_PROJECT_PAGE:
      return [];
    case CONFIG_PROJECT_PAGE:
      return action.data.collaboratorsList;
    case ADD_COLLABORATOR:
      return [...state, action.userInfo];
    case REMOVE_COLLABORATOR:
      return state.filter(user => user.id_user !== action.userId);
    default:
      return state;
  }
}

let defaultModal = {
  title: "",
  description: "",
  priority: 0,
  difficulty: 0,
  state: 1,
};

function editModalReducer(state = defaultModal, action) {
  switch (action.type) {
    case EXIT_PROJECT_PAGE:
      return {};
    case CONFIG_EDIT_MODAL:
      return Object.assign({}, state, action.defaults);
    default:
      return state;
  }
}

function addModalReducer(state = defaultModal, action) {
  switch (action.type) {
    case EXIT_PROJECT_PAGE:
      return {};
    case CONFIG_ADD_MODAL:
      return Object.assign({}, state, action.defaults);
    default:
      return state;
  }
}

function nightModeReducer(state = false, action) {
  switch (action.type) {
    case TOGGLE_NIGHT_MODE:
      if (action.val == undefined) return !state;
      return action.val;
    default:
      return state;
  }
}

const app = combineReducers({
  tasksList: taskReducer,
  collaboratorsList: colReducer,
  editModalConfig: editModalReducer,
  addModalConfig: addModalReducer,
  nightMode: nightModeReducer,
});

export default app;
