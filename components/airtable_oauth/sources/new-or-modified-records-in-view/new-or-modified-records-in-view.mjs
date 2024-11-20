import base from "../common/common.mjs";

export default {
  ...base,
  name: "New or Modified Record(s) In View",
  description: "Emit new event when a record is created or updated in the selected view. [See the documentation](https://airtable.com/developers/web/api/list-records)",
  key: "airtable_oauth-new-or-modified-records-in-view",
  version: "0.0.6",
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
      description: "Select a table to watch for records, or provide a table ID.",
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
      description: "Select a view to watch for records, or provide a view ID.",
    },
    returnFieldsByFieldId: {
      propDefinition: [
        base.props.airtable,
        "returnFieldsByFieldId",
      ],
    },
  },
  async run(event) {
    const {
      baseId,
      tableId,
      viewId,
    } = this;

    const lastTimestamp = this._getLastTimestamp();
    const params = {
      view: viewId,
      filterByFormula: `LAST_MODIFIED_TIME() > "${lastTimestamp}"`,
      returnFieldsByFieldId: this.returnFieldsByFieldId || false,
    };

    const records = await this.airtable.listRecords({
      baseId,
      tableId,
      params,
    });

    if (!records.length) {
      console.log("No new or modified records.");
      return;
    }

    const metadata = {
      baseId,
      tableId,
      viewId,
    };

    let newRecords = 0, modifiedRecords = 0;
    for (const record of records) {
      if (!lastTimestamp || Date.parse(record.createdTime) > Date.parse(lastTimestamp)) {
        record.type = "new_record";
        newRecords++;
      } else {
        record.type = "record_modified";
        modifiedRecords++;
      }

      record.metadata = metadata;

      const id = record.id;
      this.$emit(record, {
        summary: `${record.type === "new_record"
          ? "New"
          : "Updated"} record: ${id}`,
        id,
        ts: Date.now(),
      });
    }
    console.log(`Emitted ${newRecords} new records(s) and ${modifiedRecords} modified record(s).`);

    // We keep track of the timestamp of the current invocation
    this.updateLastTimestamp(event);
  },
};
