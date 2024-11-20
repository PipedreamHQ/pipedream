import base from "../common/common.mjs";

export default {
  ...base,
  name: "New Record(s) Created In Table",
  description: "Emit new event when a record is created in the selected table. [See the documentation](https://airtable.com/developers/web/api/list-records)",
  key: "airtable_oauth-new-records",
  version: "0.0.7",
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
      description: "Select a table to watch for new records, or provide a table ID.",
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
      filterByFormula: `CREATED_TIME() > "${lastTimestamp}"`,
      returnFieldsByFieldId: this.returnFieldsByFieldId || false,
    };

    const records = await this.airtable.listRecords({
      baseId,
      tableId,
      params,
    });

    if (!records.length) {
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
    for (const record of records) {
      record.metadata = metadata;
      const ts = Date.parse(record.createdTime).valueOf();
      const id = record.id;

      this.$emit(record, {
        ts,
        summary: `New record: ID ${id}`,
        id,
      });
      if (!maxTimestamp || ts > Date.parse(maxTimestamp).valueOf()) {
        maxTimestamp = record.createdTime;
      }
      recordCount++;
    }
    console.log(`Emitted ${recordCount} new records(s).`);
    this._setLastTimestamp(maxTimestamp);
  },
};
