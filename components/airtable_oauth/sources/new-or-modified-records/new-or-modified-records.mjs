import base from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";
import common from "../../../airtable/sources/new-or-modified-records/common.mjs";

export default {
  ...base,
  ...common,
  name: "New or Modified Records",
  key: "airtable_oauth-new-or-modified-records",
  description: "Emit new event for each new or modified record in a table",
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
  },
  sampleEmit,
};
