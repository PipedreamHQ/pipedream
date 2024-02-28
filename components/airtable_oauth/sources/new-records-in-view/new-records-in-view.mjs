import base from "../common/common.mjs";
import moment from "moment";

export default {
  ...base,
  name: "New Records in View",
  description: "Emit new event for each new record in a view",
  key: "airtable_oauth-new-records-in-view",
  version: "0.0.5",
  type: "source",
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
    viewId: {
      propDefinition: [
        base.props.airtable,
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
    returnFieldsByFieldId: {
      propDefinition: [
        base.props.airtable,
        "returnFieldsByFieldId",
      ],
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
      returnFieldsByFieldId: this.returnFieldsByFieldId,
    };

    const data = await this.airtable.listRecords({
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
