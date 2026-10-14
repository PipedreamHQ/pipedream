function getItemName(item) {
  if (typeof item === "string") {
    return item;
  }
  return item.name ?? item.tableName ?? item.schemaName;
}

function namesOf(list) {
  return (list ?? []).map(getItemName);
}

export default {
  getItemName,
  namesOf,
};
