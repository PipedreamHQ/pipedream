const moment = require("moment");
const axios = require("axios");

const common = require("../common");

module.exports = {
  ...common,
  name: "New or Modified Records",
  key: "airtable-new-or-modified-records",
  description: "Emit an event for each new or modified record in a table",
  version: "0.0.5",
  props: {
    ...common.props,
    tableId: {
      type: "$.airtable.tableId",
      baseIdProp: "baseId",
    },
  },
  async run(event) {
    const config = {
      url: `https://api.airtable.com/v0/${encodeURIComponent(this.baseId)}/${encodeURIComponent(this.tableId)}`,
      params: {},
      headers: {
        Authorization: `Bearer ${this.airtable.$auth.api_key}`,
      },
    };

    const lastTimestamp = this.db.get("lastTimestamp");
    config.params.filterByFormula = `LAST_MODIFIED_TIME() > "${lastTimestamp}"`;

    const { data } = await axios(config);

    if (!data.records.length) {
      console.log("No new or modified records.");
      return;
    }

    const {
      baseId,
      tableId,
      viewId,
    } = this;
    const metadata = {
      baseId,
      tableId,
      viewId,
    };

    let newRecords = 0, modifiedRecords = 0;
    for (const record of data.records) {
      if (!lastTimestamp || moment(record.createdTime) > moment(lastTimestamp)) {
        record.type = "new_record";
        newRecords++;
      } else {
        record.type = "record_modified";
        modifiedRecords++;
      }

      record.metadata = metadata;

      this.$emit(record, {
        summary: `${record.type}: ${JSON.stringify(record.fields)}`,
        id: record.id,
      });
    }
    console.log(`Emitted ${newRecords} new records(s) and ${modifiedRecords} modified record(s).`);

    // We keep track of the timestamp of the current invocation
    this.updateLastTimestamp(event);
  },
};
