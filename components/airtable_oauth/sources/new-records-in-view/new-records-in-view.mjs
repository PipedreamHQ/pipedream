import base from "../common/common.mjs";
import common from "../../../airtable/sources/new-records-in-view/common.mjs";

export default {
  ...base,
  ...common,
  name: "New Records in View",
  description: "Emit new event for each new record in a view",
  key: "airtable_oauth-new-records-in-view",
  version: "0.0.3",
  type: "source",
  props: {
    ...base.props,
    tableId: {
      propDefinition: [
        base.props.airtable,
        "tableId",
        ({ baseId }) => ({
          baseId,
        }),
      ],
      description: "The table ID to watch for changes.",
    },
    viewId: {
      propDefinition: [
        base.props.airtable,
        "viewId",
        ({
          baseId, tableId,
        }) => ({
          baseId,
          tableId,
        }),
      ],
      description: "The view ID to watch for changes.",
    },
  },
};
