import common from "../common/base-polling.mjs";
import md5 from "md5";

export default {
  ...common,
  key: "highlevel_oauth-record-updated",
  name: "Record Updated",
  description: "Emit new event when a record is created or updated. [See the documentation](https://highlevel.stoplight.io/docs/integrations/0d0d041fb90fb-search-object-records)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    schemaKey: {
      propDefinition: [
        common.props.app,
        "schemaKey",
      ],
    },
  },
  methods: {
    ...common.methods,
    _getRecordValues() {
      return this.db.get("recordValues") || {};
    },
    _setRecordValues(recordValues) {
      this.db.set("recordValues", recordValues);
    },
    generateMeta(record, createdOrUpdated) {
      const ts = Date.now();
      return {
        id: `${record.id}${ts}`,
        summary: `Record ${createdOrUpdated} w/ ID: ${record.id}`,
        ts,
      };
    },
  },
  async run() {
    const params = {
      page: 1,
      pageLimit: 100,
      locationId: this.app.getLocationId(),
      schemaKey: this.schemaKey,
    };
    let total;
    const recordValues = this._getRecordValues();
    const newRecordValues = {};

    do {
      const { customObjectRecords } = await this.app.searchRecords({
        params,
      });
      for (const record of customObjectRecords) {
        const hash = md5(JSON.stringify(record));
        if (recordValues[record.id] !== hash) {
          const createOrUpdate = recordValues[record.id]
            ? "Updated"
            : "Created";
          const meta = this.generateMeta(record, createOrUpdate);
          this.$emit(record, meta);
        }
        newRecordValues[record.id] = hash;
      }
      params.page++;
      total = customObjectRecords?.length;
    } while (total === params.pageLimit);

    this._setRecordValues(newRecordValues);
  },
};
