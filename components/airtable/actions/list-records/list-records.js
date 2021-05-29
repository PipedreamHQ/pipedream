const common = require("../common.js");
const commonList = require("../common-list.js");

module.exports = {
  key: "airtable-list-records",
  name: "List Records",
  description: "Retrieve records from a table with automatic pagination. Optionally sort and filter results.",
  type: "action",
  version: "0.1.0",
  ...commonList,
  props: {
    ...common.props,
    ...commonList.props,
  },
};
