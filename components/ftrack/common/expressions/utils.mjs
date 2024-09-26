function getWhereClause(where) {
  return where
    ? `where ${where}`
    : "";
}

export default {
  getWhereClause,
};
