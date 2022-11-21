import moment from "moment";
import axios from "axios";

import common from "../common.mjs";

export default {
  ...common,
  name: "New or Modified Records",
  key: "airtable-new-or-modified-records",
  description: "Emit an event for each new or modified record in a table",
  version: "0.1.1",
  type: "source",
  props: {
    ...common.props,
    tableId: {
      propDefinition: [
        common.props.airtable,
        "tableId",
        ({ baseId }) => ({
          baseId,
        }),
      ],
    },
  },
  async run(event) {
    const {
      baseId,
      tableId,
      viewId,
    } = this;

    const config = {
      url: `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableId)}`,
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
