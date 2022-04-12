import airtable from "../../airtable.app.mjs";
import {
  makeFieldProps,
  makeRecord,
} from "../../common/utils.mjs";
import common from "../common.mjs";

export default {
  key: "airtable-create-single-record",
  name: "Create single record",
  description: "Adds a record to a table.",
  version: "0.1.2",
  type: "action",
  props: {
    ...common.props,
    // eslint-disable-next-line pipedream/props-label,pipedream/props-description
    table: {
      ...common.props.table,
      isSchema: true,
      reloadProps: true,
    },
    typecast: {
      propDefinition: [
        airtable,
        "typecast",
      ],
    },
  },
  async additionalProps() {
    return makeFieldProps(this.table);
  },
  async run() {
    const table = this.airtable.base(this.baseId)(this.tableId);

    const record = makeRecord(this);

    this.airtable.validateRecord(record);

    const data = [
      {
        fields: record,
      },
    ];

    const params = {
      typecast: this.typecast,
    };

    try {
      const [
        response,
      ] = await table.create(data, params);
      return response;
    } catch (err) {
      this.airtable.throwFormattedError(err);
    }
  },
};
