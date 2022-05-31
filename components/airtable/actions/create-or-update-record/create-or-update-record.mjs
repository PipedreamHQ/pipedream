import airtable from "../../airtable.app.mjs";
import {
  makeFieldProps,
  makeRecord,
} from "../../common/utils.mjs";
import common from "../common.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "airtable-create-single-record-or-update",
  name: "Create single record or update",
  description: "Updates a record if `recordId` is provided or adds a record to a table.",
  version: "0.0.3",
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
    recordId: {
      propDefinition: [
        airtable,
        "recordId",
      ],
      optional: true,
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
    const recordId = this.recordId ?? undefined;
    if (!recordId) {
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
    } else {
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
    }
  },
};
