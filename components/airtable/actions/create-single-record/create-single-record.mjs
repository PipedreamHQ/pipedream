import airtable from "../../airtable.app.mjs";
import {
  makeFieldProps,
  makeRecord,
} from "../../common/utils.mjs";
import common from "../common.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "airtable-create-single-record",
  name: "Create single record",
  description: "Adds a record to a table.",
  version: "1.0.1",
  type: "action",
  props: {
    ...common.props,
    // eslint-disable-next-line pipedream/props-label,pipedream/props-description
    tableId: {
      ...common.props.tableId,
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
    const baseId = this.baseId?.value ?? this.baseId;
    const tableId = this.tableId?.value ?? this.tableId;
    try {
      const tableSchema = await this.airtable.table(baseId, tableId);
      return makeFieldProps(tableSchema);
    } catch (err) {
      const hasManualTableInput = !this.tableId?.label;
      // If manual input and .table throws error, return a record prop
      // otherwise, throw ConfigurationError
      if (hasManualTableInput) {
        return {
          // Use record propDefinition directly to workaround lack of support
          // for propDefinition in additionalProps
          record: airtable.propDefinitions.record,
        };
      }
      throw new ConfigurationError("Could not find a table for the specified base ID and table ID. Please adjust the action configuration to continue.");
    }
  },
  async run({ $ }) {
    const baseId = this.baseId?.value ?? this.baseId;
    const tableId = this.tableId?.value ?? this.tableId;

    const table = this.airtable.base(baseId)(tableId);

    const record = this.record ?? makeRecord(this);

    this.airtable.validateRecord(record);

    const data = [
      {
        fields: record,
      },
    ];

    const params = {
      typecast: this.typecast,
    };

    let response;
    try {
      [
        response,
      ] = await table.create(data, params);
    } catch (err) {
      this.airtable.throwFormattedError(err);
    }

    $.export("$summary", `Added 1 record to ${this.baseId?.label || baseId}: [${this.tableId?.label || tableId}](https://airtable.com/${baseId}/${tableId})`);
    return response;
  },
};
