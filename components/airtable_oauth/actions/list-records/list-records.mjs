// x-pd-ai: optimized
import common from "../common/common.mjs";
import commonList from "../common/common-list.mjs";

export default {
  key: "airtable_oauth-list-records",
  name: "List Records",
  description: "Retrieve records from a table, optionally sorting and filtering results. Use **List Tables** to look up a table's field IDs. [See the documentation](https://airtable.com/developers/web/api/list-records)",
  type: "action",
  version: "0.0.16",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  ...commonList,
  props: {
    ...common.props,
    ...commonList.props,
  },
};
