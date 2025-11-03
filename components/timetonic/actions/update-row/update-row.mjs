import common from "../common/create-update-row.mjs";

export default {
  ...common,
  key: "timetonic-update-row",
  name: "Update Row",
  description: "Updates the values within a specified row in a table. [See the documentation](https://timetonic.com/live/apidoc/#api-Smart_table_operations-createOrUpdateTableRow)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    rowId: {
      propDefinition: [
        common.props.timetonic,
        "rowId",
        (c) => ({
          tableId: c.tableId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    isUpdate() {
      return true;
    },
  },
};
