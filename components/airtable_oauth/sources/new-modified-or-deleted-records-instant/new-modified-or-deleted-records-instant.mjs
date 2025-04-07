import common from "../common/common-webhook-record.mjs";
import constants from "../common/constants.mjs";
import sampleEmit from "./test-event.mjs";
import airtable from "../../airtable_oauth.app.mjs";

export default {
  ...common,
  name: "New Record Created, Updated or Deleted (Instant)",
  description: "Emit new event when a record is added, updated, or deleted in a table or selected view.",
  key: "airtable_oauth-new-modified-or-deleted-records-instant",
  version: "0.1.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    changeTypes: {
      type: "string[]",
      label: "Update Types",
      description: "Select the types of record updates that should emit events. If not specified, all updates will emit events.",
      options: constants.CHANGE_TYPES,
      optional: true,
      default: [
        "add",
        "remove",
        "update",
      ],
    },
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
  methods: {
    ...common.methods,
    getDataTypes() {
      return [
        "tableData",
      ];
    },
  },
  sampleEmit,
};
