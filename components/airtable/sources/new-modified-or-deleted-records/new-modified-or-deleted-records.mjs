import base from "../common/common.mjs";
import common from "./common.mjs";

export default {
  ...base,
  ...common,
  name: "New, Modified or Deleted Records",
  key: "airtable-new-modified-or-deleted-records",
  version: "0.2.3",
  type: "source",
  description: "Emit new event each time a record is added, updated, or deleted in an Airtable table. Supports tables up to 10,000 records",
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
  methods: {
    ...base.methods,
    ...common.methods,
  },
};
