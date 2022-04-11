const airtable = require("../../airtable.app.js");
const {
  makeFieldProps,
  makeRecord,
} = require("../../common/utils.js");
const common = require("../common.js");

module.exports = {
  key: "airtable-update-record",
  name: "Update record",
  description: "Update a single record in a table by Record ID.",
  version: "0.1.0",
  type: "action",
  props: {
    ...common.props,
    // eslint-disable-next-line pipedream/props-label,pipedream/props-description
    table: {
      ...common.props.table,
      isSchema: true,
      reloadProps: true,
    },
    recordId: {
      propDefinition: [
        airtable,
        "recordId",
      ],
    },
  },
  async additionalProps() {
    return makeFieldProps(this.table);
  },
  async run() {
    this.airtable.validateRecordID(this.recordId);

    const record = makeRecord(this);

    const base = this.airtable.base(this.baseId);
    try {
      return (await base(this.tableId).update([
        {
          id: this.recordId,
          fields: record,
        },
      ]))[0];
    } catch (err) {
      this.airtable.throwFormattedError(err);
    }
  },
};
