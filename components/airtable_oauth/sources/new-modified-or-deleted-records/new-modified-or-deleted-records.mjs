import base from "../common/common.mjs";
import moment from "moment";

export default {
  ...base,
  name: "New, Modified or Deleted Records",
  description: "Emit new event each time a record is added, updated, or deleted in an Airtable table. Supports tables up to 10,000 records",
  key: "airtable_oauth-new-modified-or-deleted-records",
  version: "0.0.14",
  type: "source",
  dedupe: "unique",
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
    returnFieldsByFieldId: {
      propDefinition: [
        base.props.airtable,
        "returnFieldsByFieldId",
      ],
    },
  },
  methods: {
    ...base.methods,
    _getPrevAllRecordIds() {
      return this.db.get("prevAllRecordIds");
    },
    _setPrevAllRecordIds(prevAllRecordIds) {
      this.db.set("prevAllRecordIds", prevAllRecordIds);
    },
  },
  async run(event) {
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

    const prevAllRecordIds = this._getPrevAllRecordIds();

    const lastTimestamp = this._getLastTimestamp();
    const params = this.getListRecordsParams({
      formula: `LAST_MODIFIED_TIME() > "${lastTimestamp}"`,
    });

    const records = await this.airtable.listRecords({
      baseId,
      tableId,
      params,
    });

    let newRecordsCount = 0,
      modifiedRecordsCount = 0,
      deletedRecordsCount = 0;

    if (records) {
      for (const record of records) {
        if (!lastTimestamp || moment(record.createdTime) > moment(lastTimestamp)) {;
          this.$emit({
            ...record,
            type: "new_record",
            metadata,
          }, {
            id: record.id,
            summary: `New record: ${record.id}`,
            ts: moment(record.createdTime).valueOf(),
          });
          newRecordsCount++;

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
          modifiedRecordsCount++;
        }
      }
    }

    delete params.filterByFormula;

    const data = await this.airtable.listRecords({
      baseId,
      tableId,
      params,
    });

    const allRecordIds = data.map((record) => record.id);

    if (prevAllRecordIds) {
      const currentRecordIdSet = new Set(allRecordIds);
      const deletedRecordIds =
        prevAllRecordIds.filter((prevRecord) => !currentRecordIdSet.has(prevRecord));

      for (const recordID of deletedRecordIds) {
        const ts = Date.now();
        const id = `${recordID}-${ts}`;
        this.$emit({
          id: recordID,
          metadata,
          type: "record_deleted",
        }, {
          id,
          summary: `Record deleted: ${recordID}`,
          ts,
        });
        deletedRecordsCount++;
      }
    }

    console.log(
      `Emitted ${newRecordsCount} new records(s) and ${modifiedRecordsCount} modified record(s) and ${deletedRecordsCount} deleted records.`,
    );
    this._setPrevAllRecordIds(allRecordIds);

    // We keep track of the timestamp of the current invocation
    this.updateLastTimestamp(event);
  },
};
