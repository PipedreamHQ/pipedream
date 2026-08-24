import {
  getTableFields,
  makeRecord,
  normalizeRecord,
  parseRecord,
  validateWritableFields,
} from "./utils.mjs";

/**
 * Builds the record to send to Airtable. Prefers the `record` prop, falling
 * back to the `field_*` props that workflows configured against earlier
 * versions of these actions still carry.
 */
const resolveRecord = async (ctx) => {
  const record = ctx.record
    ? parseRecord(ctx.record)
    : makeRecord(ctx);

  ctx.airtable.validateRecord(record);

  const fields = await getTableFields(ctx);
  validateWritableFields(record, fields);
  return normalizeRecord(record, fields);
};

export default {
  createRecord: async (ctx, $) => {
    const baseId = ctx.baseId?.value ?? ctx.baseId;
    const tableId = ctx.tableId?.value ?? ctx.tableId;

    const record = await resolveRecord(ctx);

    let response;
    try {
      response = await ctx.airtable.createRecord({
        baseId,
        tableId,
        data: record,
        opts: {
          typecast: ctx.typecast,
          returnFieldsByFieldId: ctx.returnFieldsByFieldId,
        },
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
    const record = await resolveRecord(ctx);

    let response;
    try {
      response = await ctx.airtable.updateRecord({
        baseId,
        tableId,
        recordId,
        data: record,
        opts: {
          typecast: ctx.typecast,
          returnFieldsByFieldId: ctx.returnFieldsByFieldId,
        },
      });
    } catch (err) {
      ctx.airtable.throwFormattedError(err);
    }

    $.export("$summary", `Updated record "${recordId}" in ${ctx.baseId?.label || baseId}: [${ctx.tableId?.label || tableId}](https://airtable.com/${baseId}/${tableId})`);
    return response;
  },
  getRecord: async (ctx, $) => {
    const baseId = ctx.baseId?.value ?? ctx.baseId;
    const tableId = ctx.tableId?.value ?? ctx.tableId;
    const recordId = ctx.recordId;

    ctx.airtable.validateRecordID(recordId);
    const response = await ctx.airtable.getRecord({
      baseId,
      tableId,
      recordId,
      // Added 2025-04-22: Ensure returnFieldsByFieldId is passed to the API.
      // Previously, this option was defined in the action but not forwarded to the API call.
      opts: {
        returnFieldsByFieldId: ctx.returnFieldsByFieldId,
      },
    });

    $.export("$summary", `Fetched record "${recordId}" from ${ctx.baseId?.label || baseId}: [${ctx.tableId?.label || tableId}](https://airtable.com/${baseId}/${tableId})`);
    return response;
  },
};
