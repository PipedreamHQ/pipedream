const common = require("../common.js");
const commonList = require("../common-list.js");

module.exports = {
  key: "airtable-list-records-in-view",
  name: "List Records in View",
  description: "Retrieve records in a view with automatic pagination. Optionally sort and filter results.",
  type: "action",
  version: "0.1.0",
  ...commonList,
  props: {
    ...common.props,
    viewId: {
      type: "$.airtable.viewId",
      tableIdProp: "tableId",
    },
    ...commonList.props,
  },
};
