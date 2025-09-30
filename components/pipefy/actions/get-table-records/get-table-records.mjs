import pipefy from "../../pipefy.app.mjs";

export default {
  key: "pipefy-get-table-records",
  name: "Get Table Records",
  description: "Fetches all records in a table. [See the docs here](https://api-docs.pipefy.com/reference/queries/#table_records)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipefy,
    organization: {
      propDefinition: [
        pipefy,
        "organization",
      ],
    },
    table: {
      propDefinition: [
        pipefy,
        "table",
        (c) => ({
          orgId: c.organization,
        }),
      ],
    },
    max: {
      type: "integer",
      label: "Max Records",
      description: "Maximum number of records to return",
      default: 100,
    },
  },
  async run({ $ }) {
  /*
  Example query:

  {
    table_records(table_id: 301501717) {
      matchCount
    }
  }
  */

    const records = [];
    let hasNextPage, cursor;

    do {
      const {
        edges, pageInfo,
      } = await this.pipefy.listTableRecords(this.table, cursor);
      for (const edge of edges) {
        const record = {};
        for (const field of edge.node.record_fields) {
          record[field.name] = field.value;
        }
        records.push(record);
      }
      if (records.length >= this.max) {
        break;
      }
      hasNextPage = pageInfo.hasNextPage;
      cursor = pageInfo.endCursor;
    } while (hasNextPage);

    if (records.length > this.max) {
      records.length = this.max;
    }

    $.export("$summary", `Successfully retrieved ${records.length} table record(s)`);
    return records;
  },
};
