import chunk from "lodash.chunk";
import airtable from "../../airtable.app.mjs";
import common from "../common.mjs";

const BATCH_SIZE = 10; // The Airtable API allows us to update up to 10 rows per request.

export default {
  key: "airtable-create-multiple-records",
  name: "Create Multiple Records",
  description: "Create one or more records in a table by passing an array of objects containing field names and values as key/value pairs.",
  version: "0.2.0",
  type: "action",
  props: {
    ...common.props,
    records: {
      propDefinition: [
        airtable,
        "records",
      ],
    },
    typecast: {
      propDefinition: [
        airtable,
        "typecast",
      ],
    },
  },
  async run({ $ }) {
    const baseId = this.baseId?.value ?? this.baseId;
    const tableId = this.tableId?.value ?? this.tableId;

    const table = this.airtable.base(baseId)(tableId);

    let data = this.records;
    if (!Array.isArray(data)) {
      data = JSON.parse(data);
    }
    data = data.map((fields) => ({
      fields,
    }));
    if (!data.length) {
      throw new Error("No Airtable record data passed to step. Please pass at least one record");
    }

    const params = {
      typecast: this.typecast,
    };

    const responses = [];
    for (const c of chunk(data, BATCH_SIZE)) {
      try {
        responses.push(...(await table.create(c, params)));
      } catch (err) {
        this.airtable.throwFormattedError(err);
      }
    }

    const l = responses.length;
    $.export("$summary", `Added ${l} record${l === 1
      ? ""
      : "s"} to ${this.baseId?.label || baseId}: [${this.tableId?.label || tableId}](https://airtable.com/${baseId}/${tableId})`);

    return responses;
  },
};
