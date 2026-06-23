import chunk from "lodash.chunk";
import airtable from "../../airtable_oauth.app.mjs";
import common from "../common/common.mjs";
import { ConfigurationError } from "@pipedream/platform";

const BATCH_SIZE = 10; // The Airtable API allows us to update up to 10 rows per request.

export default {
  key: "airtable_oauth-create-multiple-records",
  name: "Create Multiple Records",
  description: "Create one or more records in a table in a single operation with an array. [See the documentation](https://airtable.com/developers/web/api/create-records)",
  version: "0.0.14",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    records: {
      propDefinition: [
        airtable,
        "records",
      ],
    },
    customExpressionInfo: {
      type: "alert",
      alertType: "info",
      content: `You can use a custom expression that evaluates to an object for each entry in the array, e.g. \`{{ { "foo": "bar", "id": 123 } }}\`.
\\
You can also reference an object exported by a previous step, e.g. \`{{steps.foo.$return_value}}\`.
\\
If desired, you can use a custom expression in the same fashion for the entire array instead of providing individual values.`,
    },
    typecast: {
      propDefinition: [
        airtable,
        "typecast",
      ],
    },
    returnFieldsByFieldId: {
      propDefinition: [
        airtable,
        "returnFieldsByFieldId",
      ],
    },
  },
  async run({ $ }) {
    const baseId = this.baseId?.value ?? this.baseId;
    const tableId = this.tableId?.value ?? this.tableId;

    let data = this.records;
    if (!Array.isArray(data)) {
      data = JSON.parse(data);
    }
    data = data.map((fields, index) => {
      if (typeof fields === "string") {
        try {
          fields = JSON.parse(fields);
        } catch (err) {
          throw new ConfigurationError(`Error parsing record (index ${index}) as JSON: ${err.message}`);
        }
      }
      return {
        fields,
      };
    });
    if (!data.length) {
      throw new Error("No Airtable record data passed to step. Please pass at least one record");
    }

    const responses = [];
    for (const c of chunk(data, BATCH_SIZE)) {
      try {
        const records = await this.airtable.createRecord({
          baseId,
          tableId,
          data: c,
          opts: {
            typecast: this.typecast,
            returnFieldsByFieldId: this.returnFieldsByFieldId,
          },
        });
        responses.push(...records);
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
