import airtable from "../airtable_oauth.app.mjs";
import {
  makeFieldProps, makeRecord,
} from "./utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  additionalProps: async (ctx) => {
    const baseId = ctx.baseId?.value ?? ctx.baseId;
    const tableId = ctx.tableId?.value ?? ctx.tableId;
    try {
      const { tables } = await ctx.airtable.listTables({
        baseId,
      });
      const tableSchema = tables.find(({ id }) => id === tableId);
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

    const record = ctx.record ?? makeRecord(ctx);

    ctx.airtable.validateRecord(record);

    const data = {
      fields: record,
      typecast: ctx.typecast,
      returnFieldsByFieldId: ctx.returnFieldsByFieldId,
    };

    let response;
    try {
      response = await ctx.airtable.createRecord({
        baseId,
        tableId,
        data,
        $,
      });
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

    let response;
    try {
      response = await ctx.airtable.updateRecord({
        baseId,
        tableId,
        recordId,
        data: {
          fields: record,
          typecast: ctx.typecast,
          returnFieldsByFieldId: ctx.returnFieldsByFieldId,
        },
        $,
      });
    } catch (err) {
      ctx.airtable.throwFormattedError(err);
    }

    $.export("$summary", `Updated record "${recordId}" in ${ctx.baseId?.label || baseId}: [${ctx.tableId?.label || tableId}](https://airtable.com/${baseId}/${tableId})`);
    return response;
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
        params: {
          returnFieldsByFieldId: ctx.returnFieldsByFieldId,
        },
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
