import moment from "moment";
import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Records in View",
  description: "Emit an event for each new record in a view",
  key: "airtable-new-records-in-view",
  version: "0.2.1",
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
      description: "The table ID to watch for changes.",
    },
    viewId: {
      propDefinition: [
        common.props.airtable,
        "viewId",
        ({
          baseId, tableId,
        }) => ({
          baseId,
          tableId,
        }),
      ],
      description: "The view ID to watch for changes.",
    },
  },
  async run() {
    const {
      baseId,
      tableId,
      viewId,
    } = this;

    const lastTimestamp = this._getLastTimestamp();
    const params = {
      view: viewId,
      filterByFormula: `CREATED_TIME() > "${lastTimestamp}"`,
    };

    const data = await this.airtable.getRecords({
      baseId,
      tableId,
      params,
    });

    if (!data.records.length) {
      console.log("No new records.");
      return;
    }

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
    this._setLastTimestamp(maxTimestamp);
  },
};
