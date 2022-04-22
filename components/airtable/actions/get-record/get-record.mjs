import airtable from "../../airtable.app.mjs";
import common from "../common.mjs";

export default {
  key: "airtable-get-record",
  name: "Get Record",
  description: "Get a record from a table by record ID.",
  version: "0.1.1",
  type: "action",
  props: {
    ...common.props,
    recordId: {
      propDefinition: [
        airtable,
        "recordId",
      ],
    },
  },
  async run() {
    this.airtable.validateRecordID(this.recordId);
    const base = this.airtable.base(this.baseId);
    try {
      return await base(this.table).find(this.recordId);
    } catch (err) {
      this.airtable.throwFormattedError(err);
    }
  },
};
