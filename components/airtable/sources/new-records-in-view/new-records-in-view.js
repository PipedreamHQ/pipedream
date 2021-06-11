const moment = require("moment");
const axios = require("axios");

const common = require("../common");

module.exports = {
  ...common,
  name: "New Records in View",
  description: "Emit an event for each new record in a view",
  key: "airtable-new-records-in-view",
  version: "0.0.5",
  props: {
    ...common.props,
    tableId: {
      type: "$.airtable.tableId",
      baseIdProp: "baseId",
    },
    viewId: {
      type: "$.airtable.viewId",
      tableIdProp: "tableId",
    },
  },
  async run() {
    const config = {
      url: `https://api.airtable.com/v0/${encodeURIComponent(this.baseId)}/${encodeURIComponent(this.tableId)}`,
      params: {
        view: this.viewId,
      },
      headers: {
        Authorization: `Bearer ${this.airtable.$auth.api_key}`,
      },
    };

    const lastTimestamp = this.db.get("lastTimestamp");
    config.params.filterByFormula = `CREATED_TIME() > "${lastTimestamp}"`;

    const { data } = await axios(config);

    if (!data.records.length) {
      console.log("No new records.");
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

    let maxTimestamp;
    let recordCount = 0;
    for (const record of data.records) {
      record.metadata = metadata;

      this.$emit(record, {
        ts: moment(record.createdTime).valueOf(),
        summary: JSON.stringify(record.fields),
        id: record.id,
      });
      if (!maxTimestamp || moment(record.createdTime).valueOf() > moment(maxTimestamp).valueOf()) {
        maxTimestamp = record.createdTime;
      }
      recordCount++;
    }
    console.log(`Emitted ${recordCount} new records(s).`);
    this.db.set("lastTimestamp", maxTimestamp);
  },
};
