import { Middleware } from "redux";

export const actionLog: Middleware = (store) => (next) => (action) => {
  // console.log("目前狀態", store.getState());
  // console.log("發出指令", action);
  next(action);
  // console.log("更新後狀態", store.getState());
};
