import moment from "moment";

export default {
  async run(event) {
    const {
      baseId,
      tableId,
      viewId,
    } = this;

    const lastTimestamp = this._getLastTimestamp();
    const params = {
      filterByFormula: `LAST_MODIFIED_TIME() > "${lastTimestamp}"`,
    };

    const data = await this.airtable.getRecords({
      baseId,
      tableId,
      params,
    });

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
