import common from "../common/common.mjs";
import commonList from "../common/common-list.mjs";

export default {
  key: "airtable_oauth-list-records",
  name: "List Records",
  description: "Retrieve records from a table with automatic pagination. Optionally sort and filter results.",
  type: "action",
  version: "0.0.2",
  ...commonList,
  props: {
    ...common.props,
    ...commonList.props,
  },
};
