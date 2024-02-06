import constants from "../constants.mjs";
import utils from "./utils.mjs";

function listProjects({
  offset = 0, limit = constants.DEFAUL_LIMIT, where,
} = {}) {
  return `
    select id, full_name, created_at
        from Project ${utils.getWhereClause(where)}
          order by created_at desc
          offset ${offset} limit ${limit}
  `;
}

export default {
  listProjects,
};
