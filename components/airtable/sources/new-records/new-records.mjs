import moment from "moment";
import axios from "axios";

import common from "../common.mjs";

export default {
  ...common,
  name: "New Records",
  description: "Emit an event for each new record in a table",
  key: "airtable-new-records",
  version: "0.0.6",
  type: "source",
  props: {
    ...common.props,
    tableId: {
      type: "$.airtable.tableId",
      baseIdProp: "baseId",
    },
  },
  async run() {
    const config = {
      url: `https://api.airtable.com/v0/${encodeURIComponent(this.baseId)}/${encodeURIComponent(this.tableId)}`,
      params: {},
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
      table,
      viewId,
    } = this;
    const metadata = {
      baseId,
      tableId: table,
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
