async function getColumnProps(table) {
  const props = {};
  const columns = await this.mysql.listColumnNames(table);
  for (const column of columns) {
    props[column] = {
      type: "string",
      label: column,
      optional: true,
    };
  }
  return props;
}

async function getColumnAndValueArrays(table) {
  const columns = [];
  const values = [];
  const columnNames = await this.mysql.listColumnNames(table);
  for (const column of columnNames) {
    if (this[column]) {
      columns.push(column);
      values.push(this[column]);
    }
  }
  return {
    columns,
    values,
  };
}
export default {
  getColumnProps,
  getColumnAndValueArrays,
};
