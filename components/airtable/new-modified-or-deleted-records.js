const airtable = require('https://github.com/PipedreamHQ/pipedream/components/airtable/airtable.app.js');
const moment = require('moment');
const axios = require('axios');
const Bottleneck = require('bottleneck');

const limiter = new Bottleneck({
  minTime: 200, // 5 requets per second
});
const axiosRateLimiter = limiter.wrap(axios);

module.exports = {
  name: 'New, Modified or Deleted Records',
  version: '0.0.1',
  description:
    "Emits an event each time a record is added, updated, or deleted in an Airtable table. Supports tables up to 10,000 records",
  props: {
    db: '$.service.db',
    airtable,
    baseId: { type: '$.airtable.baseId', appProp: 'airtable' },
    tableId: { type: '$.airtable.tableId', baseIdProp: 'baseId' },
    timer: {
      type: '$.interface.timer',
      default: {
        intervalSeconds: 60 * 5,
      },
    },
  },
  async run(event) {
    const { baseId, tableId, viewId } = this;
    const metadata = {
      baseId,
      tableId,
      viewId,
    };

    const config = {
      url: `https://api.airtable.com/v0/${encodeURIComponent(this.baseId)}/${encodeURIComponent(this.tableId)}`,
      params: {},
      headers: {
        Authorization: `Bearer ${this.airtable.$auth.api_key}`,
      },
    };

    const lastTimestamp = this.db.get('lastTimestamp');
    const prevAllRecordIds = this.db.get('prevAllRecordIds');

    if (lastTimestamp) {
      config.params.filterByFormula = `LAST_MODIFIED_TIME() > "${lastTimestamp}"`;
    }
    const timestamp = new Date().toISOString();
    const { data } = await axios(config);

    let allRecordIds = [],
      newRecordsCount = 0,
      modifiedRecordsCount = 0,
      deletedRecordsCount = 0;

    if (data.records) {
      for (let record of data.records) {
        if (!lastTimestamp || moment(record.createdTime) > moment(lastTimestamp)) {
          record.type = 'new_record';
          newRecordsCount++;
        } else {
          record.type = 'record_modified';
          modifiedRecordsCount++;
        }

        record.metadata = metadata;

        this.$emit(record, {
          summary: `${record.type}: ${JSON.stringify(record.fields)}`,
          id: record.id,
        });
      }
    }

    delete config.params.filterByFormula;

    while (allRecordIds.length === 0 || config.params.offset) {
      const { data } = await axiosRateLimiter(config);
      if (!data.records.length || data.records.length === 0) return;
      allRecordIds = [
        ...allRecordIds,
        ...data.records.map(record => record.id)
      ];
      if (data.offset) {
        config.params.offset = data.offset;
      } else {
        delete config.params.offset;
      }
    }

    if (prevAllRecordIds) {
      let deletedRecordIds = prevAllRecordIds.filter(
        prevRecord => !allRecordIds.includes(prevRecord)
      );
      for (let recordID of deletedRecordIds) {
        deletedRecordsCount++;
        deletedRecordObj = {
          metadata,
          type: "record_deleted",
          id: recordID
        };
        this.$emit(deletedRecordObj, {
          summary: "record_deleted",
          id: recordID
        });
      }
    }

    console.log(
      `Emitted ${newRecordsCount} new records(s) and ${modifiedRecordsCount} modified record(s) and ${deletedRecordsCount} deleted records.`
    );
    this.db.set('prevAllRecordIds', allRecordIds);
    this.db.set('lastTimestamp', timestamp);
  },
};
