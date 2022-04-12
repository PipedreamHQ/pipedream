import common from "../common.mjs";
import commonList from "../common-list.mjs";

export default {
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
      tableIdProp: "table",
    },
    ...commonList.props,
  },
};
