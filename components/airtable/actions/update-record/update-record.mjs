import airtable from "../../airtable.app.mjs";
import {
  makeFieldProps,
  makeRecord,
} from "../../common/utils.mjs";
import common from "../common.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "airtable-update-record",
  name: "Update record",
  description: "Update a single record in a table by Record ID.",
  version: "1.0.0",
  type: "action",
  props: {
    ...common.props,
    // eslint-disable-next-line pipedream/props-label,pipedream/props-description
    tableId: {
      ...common.props.tableId,
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
    const baseId = this.baseId?.value ?? this.baseId;
    const tableId = this.tableId?.value ?? this.tableId;
    try {
      const tableSchema = await this.airtable.table(baseId, tableId);
      return makeFieldProps(tableSchema);
    } catch (err) {
      const hasManualTableInput = !this.tableId?.label;
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
    const recordId = this.recordId;

    this.airtable.validateRecordID(recordId);

    const record = this.record ?? makeRecord(this);

    const base = this.airtable.base(baseId);
    let response;
    try {
      response = (await base(tableId).update([
        {
          id: recordId,
          fields: record,
        },
      ]));
    } catch (err) {
      this.airtable.throwFormattedError(err);
    }

    $.export("$summary", `Updated record "${recordId}" in ${this.baseId?.label || baseId}: [${this.tableId?.label || tableId}](https://airtable.com/${baseId}/${tableId})`);
    return response[0];
  },
};
