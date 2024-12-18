import common from "../common/common-webhook-record.mjs";
import constants from "../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  name: "New Record Created, Updated or Deleted (Instant)",
  description: "Emit new event when a record is added, updated, or deleted in a table or selected view. [See the documentation](https://airtable.com/developers/web/api/create-a-webhook)",
  key: "airtable_oauth-new-modified-or-deleted-records-instant",
  version: "0.1.0",
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
    },
  },
  methods: {
    ...common.methods,
    getDataTypes() {
      return ["tableData"];
    }
  },
  sampleEmit,
};
