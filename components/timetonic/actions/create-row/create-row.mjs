import common from "../common/create-update-row.mjs";

export default {
  ...common,
  key: "timetonic-create-row",
  name: "Create Row",
  description: "Create a new row within an existing table in TimeTonic. [See the documentation](https://timetonic.com/live/apidoc/#api-Smart_table_operations-createOrUpdateTableRow)",
  version: "0.0.1",
  type: "action",
};
