import common from "../common.mjs";
import commonList from "../common-list.mjs";

export default {
  key: "airtable-list-records-in-view",
  name: "List Records in View",
  description: "Retrieve records in a view with automatic pagination. Optionally sort and filter results.",
  type: "action",
  version: "0.2.0",
  ...commonList,
  props: {
    ...common.props,
    viewId: {
      propDefinition: [
        common.props.airtable,
        "viewId",
        ({
          baseId, tableId,
        }) => ({
          baseId,
          tableId,
        }),
      ],
      withLabel: true,
    },
    ...commonList.props,
  },
};
