import common from "../common/common-webhook-record.mjs";
import airtable from "../../airtable_oauth.app.mjs";

export default {
  ...common,
  name: "New or Modified Records (Instant)",
  key: "airtable_oauth-new-or-modified-records",
  description: "Emit new event for each new or modified record in a table or view",
  version: "1.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getChangeTypes() {
      return [
        "add",
        "update",
      ];
    },
  },
  props: {
    ...common.props,
    watchDataInFieldIds: {
      propDefinition: [
        airtable,
        "sortFieldId",
        (c) => ({
          baseId: c.baseId,
          tableId: c.tableId,
        }),
      ],
      type: "string[]",
      label: "Watch Data In Field Ids",
      description:
        "Only emit events for updates that modify values in cells in these fields. If omitted, all fields within the table/view/base are watched",
    },
  },
};
