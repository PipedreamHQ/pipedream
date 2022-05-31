import {
  makeFieldProps,
  makeRecord,
} from "../../common/utils.mjs";
import airtable from "../../airtable.app.mjs";
import common from "../common.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "airtable-get-record-or-create",
  name: "Get Record or Create",
  description: "Get a record from a table by record ID or create a new register.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    tableId: {
      propDefinition: [
        airtable,
        "tableId",
      ],
      reloadProps: true,
    },
    recordId: {
      propDefinition: [
        airtable,
        "recordId",
      ],
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const recordId = this.recordId ?? undefined;
    if (!recordId) {
      const baseId = this.baseId?.value ?? this.baseId;
      const tableId = this.tableId?.value ?? this.tableId;
      try {
        const tableSchema = await this.airtable.table(baseId, tableId);
        return {
          typecast: {
            type: "boolean",
            label: "Typecast",
            description: "The Airtable API will perform best-effort automatic data conversion from string values if the typecast parameter is `True`. Automatic conversion is disabled by default to ensure data integrity, but it may be helpful for integrating with 3rd party data sources.",
          },
          ...makeFieldProps(tableSchema),
        };
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
    }
    return {};
  },
  async run({ $ }) {
    const baseId = this.baseId?.value ?? this.baseId;
    const tableId = this.tableId?.value ?? this.tableId;
    const recordId = this.recordId ?? undefined;

    if (recordId) {
      this.airtable.validateRecordID(recordId);
      const base = this.airtable.base(baseId);
      let response;
      try {
        response = await base(tableId).find(recordId);
      } catch (err) {
        this.airtable.throwFormattedError(err);
      }
      $.export("$summary", `Fetched record "${recordId}" from ${this.baseId?.label || baseId}: [${this.tableId?.label || tableId}](https://airtable.com/${baseId}/${tableId})`);
      return response;
    } else {
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
    }
  },
};
