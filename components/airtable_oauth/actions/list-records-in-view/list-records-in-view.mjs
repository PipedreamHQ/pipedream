import common from "../common/common.mjs";
import commonList from "../common/common-list.mjs";

export default {
  key: "airtable_oauth-list-records-in-view",
  name: "List Records in View",
  description: "Retrieve records in a view with automatic pagination. Optionally sort and filter results. Only available for Enterprise accounts.",
  type: "action",
  version: "0.0.5",
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
          baseId: baseId.value,
          tableId: tableId.value,
        }),
      ],
      withLabel: true,
    },
    ...commonList.props,
  },
};
