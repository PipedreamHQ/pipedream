import base from "../common/common.mjs";
import moment from "moment";

export default {
  ...base,
  name: "New or Modified Records in View",
  description: "Emit new event for each new or modified record in a view",
  key: "airtable_oauth-new-or-modified-records-in-view",
  version: "0.0.15",
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
  async run(event) {
    const {
      baseId,
      tableId,
      viewId,
    } = this;

    const lastTimestamp = this._getLastTimestamp();
    const params = this.getListRecordsParams({
      view: viewId,
      formula: `LAST_MODIFIED_TIME() > "${lastTimestamp}"`,
    });

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
      if (!lastTimestamp || moment(record.createdTime) > moment(lastTimestamp)) {
        this.$emit({
          ...record,
          type: "new_record",
          metadata,
        }, {
          id: record.id,
          summary: `New record: ${record.id}`,
          ts: moment(record.createdTime).valueOf(),
        });
        newRecords++;

      } else {
        const ts = Date.now();
        const id = `${record.id}-${ts}`;
        this.$emit({
          ...record,
          type: "record_modified",
          metadata,
        }, {
          id,
          summary: `Record modified: ${record.id}`,
          ts,
        });
        modifiedRecords++;
      }
    }
    console.log(`Emitted ${newRecords} new records(s) and ${modifiedRecords} modified record(s).`);

    // We keep track of the timestamp of the current invocation
    this.updateLastTimestamp(event);
  },
};
