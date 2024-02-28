import base from "../common/common.mjs";
import moment from "moment";

export default {
  ...base,
  name: "New, Modified or Deleted Records",
  key: "airtable_oauth-new-modified-or-deleted-records",
  version: "0.0.5",
  type: "source",
  description: "Emit new event each time a record is added, updated, or deleted in an Airtable table. Supports tables up to 10,000 records",
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
    const params = {
      filterByFormula: `LAST_MODIFIED_TIME() > "${lastTimestamp}"`,
      returnFieldsByFieldId: this.returnFieldsByFieldId,
    };

    const data = await this.airtable.listRecords({
      baseId,
      tableId,
      params,
    });

    let allRecordIds = [],
      newRecordsCount = 0,
      modifiedRecordsCount = 0,
      deletedRecordsCount = 0;

    if (data.records) {
      for (const record of data.records) {
        if (!lastTimestamp || moment(record.createdTime) > moment(lastTimestamp)) {
          record.type = "new_record";
          newRecordsCount++;
        } else {
          record.type = "record_modified";
          modifiedRecordsCount++;
        }

        record.metadata = metadata;

        this.$emit(record, {
          summary: `${record.type}: ${JSON.stringify(record.fields)}`,
          id: record.id,
        });
      }
    }

    delete params.filterByFormula;

    while (allRecordIds.length === 0 || params.offset) {
      const data = await this.airtable.listRecords({
        baseId,
        tableId,
        params,
        rateLimited: true,
      });
      if (!data.records.length || data.records.length === 0) return;
      allRecordIds = [
        ...allRecordIds,
        ...data.records.map((record) => record.id),
      ];
      if (data.offset) {
        params.offset = data.offset;
      } else {
        delete params.offset;
      }
    }

    if (prevAllRecordIds) {
      const deletedRecordIds = prevAllRecordIds.filter(
        (prevRecord) => !allRecordIds.includes(prevRecord),
      );
      for (const recordID of deletedRecordIds) {
        deletedRecordsCount++;
        const deletedRecordObj = {
          metadata,
          type: "record_deleted",
          id: recordID,
        };
        this.$emit(deletedRecordObj, {
          summary: "record_deleted",
          id: recordID,
        });
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
