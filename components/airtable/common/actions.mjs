import airtable from "../airtable.app.mjs";
import { makeFieldProps } from "./utils.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { makeRecord } from "./utils.mjs";

export default {
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
  createRecord: async (ctx, $) => {
    const baseId = ctx.baseId?.value ?? ctx.baseId;
    const tableId = ctx.tableId?.value ?? ctx.tableId;
    const table = ctx.airtable.base(baseId)(tableId);

    const record = ctx.record ?? makeRecord(ctx);

    ctx.airtable.validateRecord(record);

    const data = [
      {
        fields: record,
      },
    ];

    const params = {
      typecast: ctx.typecast,
    };

    let response;
    try {
      [
        response,
      ] = await table.create(data, params);
    } catch (err) {
      ctx.airtable.throwFormattedError(err);
    }

    $.export("$summary", `Added 1 record to ${ctx.baseId?.label || baseId}: [${ctx.tableId?.label || tableId}](https://airtable.com/${baseId}/${tableId})`);
    return response;
  },
  updateRecord: async (ctx, $) => {
    const baseId = ctx.baseId?.value ?? ctx.baseId;
    const tableId = ctx.tableId?.value ?? ctx.tableId;
    const recordId = ctx.recordId;

    ctx.airtable.validateRecordID(recordId);
    const record = ctx.record ?? makeRecord(ctx);

    const base = ctx.airtable.base(baseId);
    let response;
    try {
      response = (await base(tableId).update([
        {
          id: recordId,
          fields: record,
        },
      ]));
    } catch (err) {
      ctx.airtable.throwFormattedError(err);
    }

    $.export("$summary", `Updated record "${recordId}" in ${ctx.baseId?.label || baseId}: [${ctx.tableId?.label || tableId}](https://airtable.com/${baseId}/${tableId})`);
    return response[0];
  },
  getRecord: async (ctx, $, throwRawError = false) => {
    const baseId = ctx.baseId?.value ?? ctx.baseId;
    const tableId = ctx.tableId?.value ?? ctx.tableId;
    const recordId = ctx.recordId;

    ctx.airtable.validateRecordID(recordId);
    const base = ctx.airtable.base(baseId);
    let response;
    try {
      response = await base(tableId).find(recordId);
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
