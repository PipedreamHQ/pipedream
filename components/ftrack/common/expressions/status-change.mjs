import constants from "../constants.mjs";
import utils from "./utils.mjs";

function listStatusChanges({
  offset = 0, limit = constants.DEFAUL_LIMIT, where,
} = {}) {
  return `
    select id, from_status_id, status_id,
      date, parent_id, parent_type, 
      from_status.name, status.name
      from StatusChange ${utils.getWhereClause(where)}
        order by id desc
        offset ${offset} limit ${limit}
  `;
}

export default {
  listStatusChanges,
};
