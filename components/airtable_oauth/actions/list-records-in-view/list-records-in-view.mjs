// x-pd-ai: optimized
import common from "../common/common.mjs";
import commonList from "../common/common-list.mjs";

export default {
  key: "airtable_oauth-list-records-in-view",
  name: "List Records in View",
  description: "Retrieve records from a view, optionally sorting and filtering results. Use **List Tables** to look up a table's view IDs. [See the documentation](https://airtable.com/developers/web/api/list-views)",
  type: "action",
  version: "0.0.16",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  ...commonList,
  props: {
    accountTierAlert: {
      type: "alert",
      alertType: "info",
      content: "Note: views are only available for Airtable Enterprise accounts. [See the documentation](https://airtable.com/developers/web/api/list-views) for more information.",
    },
    ...common.props,
    viewId: {
      propDefinition: [
        common.props.airtable,
        "viewId",
      ],
    },
    ...commonList.props,
  },
};
