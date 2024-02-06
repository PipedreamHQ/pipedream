import base from "../common/common.mjs";
import common from "./common.mjs";

export default {
  ...base,
  ...common,
  name: "New or Modified Records",
  key: "airtable-new-or-modified-records",
  description: "Emit new event for each new or modified record in a table",
  version: "0.2.3",
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
