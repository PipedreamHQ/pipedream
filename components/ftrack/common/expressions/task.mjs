import constants from "../constants.mjs";
import utils from "./utils.mjs";

function listTasks({
  offset = 0, limit = constants.DEFAUL_LIMIT, where,
} = {}) {
  return `
    select id, name, created_at,
      status.id, status.name, status.state.id, status.state.name
        from Task ${utils.getWhereClause(where)}
          order by created_at desc
          offset ${offset} limit ${limit}
  `;
}

function getTaskInfo(taskId) {
  return `
    select id, name, created_at,
      status.id, status.name, status.state.id, status.state.name
        from Task where id = "${taskId}"
  `;
}

export default {
  getTaskInfo,
  listTasks,
};
