import airtable from "../airtable_oauth.app.mjs";
import { makeFieldProps } from "../../airtable/common/utils.mjs";
import common from "../../airtable/common/actions.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  additionalProps: async (ctx) => {
    const baseId = ctx.baseId?.value ?? ctx.baseId;
    const tableId = ctx.tableId?.value ?? ctx.tableId;
    try {
      const tableSchema = await ctx.airtable.table(baseId, tableId);
      return makeFieldProps(tableSchema);
    } catch (err) {
      const hasManualTableInput = !ctx.tableId?.label;
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
  getRecord: async (ctx, $, throwRawError = false) => {
    const baseId = ctx.baseId?.value ?? ctx.baseId;
    const tableId = ctx.tableId?.value ?? ctx.tableId;
    const recordId = ctx.recordId;

    let response;
    try {
      response = await ctx.airtable.getRecord({
        baseId,
        tableId,
        recordId,
        $,
      });
    } catch (err) {
      if (throwRawError) {
        throw err;
      }
      ctx.airtable.throwFormattedError(err);
    }

    $.export("$summary", `Fetched record "${recordId}" from ${ctx.baseId?.label || baseId}: [${ctx.tableId?.label || tableId}](https://airtable.com/${baseId}/${tableId})`);
    return response;
  },
};
