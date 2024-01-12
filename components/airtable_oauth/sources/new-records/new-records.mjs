import base from "../common/common.mjs";
import common from "../../../airtable/sources/new-records/common.mjs";

export default {
  ...base,
  ...common,
  name: "New Records",
  description: "Emit new event for each new record in a table",
  key: "airtable_oauth-new-records",
  version: "0.0.2",
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
  },
};
