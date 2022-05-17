import common from "../common.mjs";
import commonList from "../common-list.mjs";

export default {
  key: "airtable-list-records",
  name: "List Records",
  description: "Retrieve records from a table with automatic pagination. Optionally sort and filter results.",
  type: "action",
  version: "0.2.0",
  ...commonList,
  props: {
    ...common.props,
    ...commonList.props,
  },
};
