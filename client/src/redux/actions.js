export const TOGGLE_NIGHT_MODE = "TOGGLE_NIGHT_MODE";
//---------- Project page ----------//
export const CONFIG_PROJECT_PAGE = "CONFIG_PROJECT_PAGE";
export const EXIT_PROJECT_PAGE = "EXIT_PROJECT_PAGE";

export const ADD_TASK = "ADD_TASK";
export const EDIT_TASK = "EDIT_TASK";
export const REMOVE_TASK = "REMOVE_TASK";

export const CONFIG_EDIT_MODAL = "CONFIG_EDIT_MODAL";
export const CONFIG_ADD_MODAL = "CONFIG_ADD_MODAL";

export const ADD_COLLABORATOR = "ADD_COLLABORATOR";
export const REMOVE_COLLABORATOR = "REMOVE_COLLABORATOR";

export function toggleNightMode(val) {
  return { type: TOGGLE_NIGHT_MODE, val };
}
//---------- Project page ----------//
export function renameProject(title) {
  return { type: RENAME_PROJECT, title };
}
export function configProjectPage(data) {
  return { type: CONFIG_PROJECT_PAGE, data };
}
export function exitProjectPage() {
  return { type: EXIT_PROJECT_PAGE };
}

export function addTask(taskInfo) {
  return { type: ADD_TASK, taskInfo };
}
export function editTask(taskInfo) {
  return { type: EDIT_TASK, taskInfo };
}
export function removeTask(taskId) {
  return { type: REMOVE_TASK, taskId };
}

export function configEditModal(defaults) {
  return { type: CONFIG_EDIT_MODAL, defaults };
}
export function configAddModal(defaults) {
  return { type: CONFIG_ADD_MODAL, defaults };
}

export function addCollaborator(userInfo) {
  return { type: ADD_COLLABORATOR, userInfo };
}
export function removeCollaborator(userId) {
  return { type: REMOVE_COLLABORATOR, userId };
}
