import constants from "../common/constants.mjs";

function getLastCursor(db) {
  return db.get(constants.LAST_CURSOR) ?? undefined;
}

function setLastCursor(db, cursor) {
  db.set(constants.LAST_CURSOR, cursor);
}

export default {
  getLastCursor,
  setLastCursor,
};
