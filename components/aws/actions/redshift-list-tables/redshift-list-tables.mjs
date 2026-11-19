import app from "../../aws.app.mjs";
import {
  props, collectPages, listResult, listSummary,
} from "../../common/list-paging.mjs";

export default {
  key: "aws-redshift-list-tables",
  name: "Redshift - List Tables",
  description: "Lists the tables and views in a Redshift database, optionally only those in a schema or matching a name pattern, each with its schema and type (`TABLE` or `VIEW`). Use it to find the `table` for **Redshift - Query Database**, **Redshift - Create Rows**, **Redshift - Update Rows** and **Redshift - Delete Rows**; run **Redshift - List Workgroups**, **Redshift - List Databases** and **Redshift - List Schemas** first. Check `truncated` first: when it is `true`, call again with `nextToken` set to the returned `nextToken`. Example result: `{ \"truncated\": false, \"nextToken\": null, \"count\": 1, \"tables\": [{ \"name\": \"orders\", \"schema\": \"public\", \"type\": \"TABLE\" }] }`. [See the documentation](https://docs.aws.amazon.com/redshift-data/latest/APIReference/API_ListTables.html)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    region: {
      propDefinition: [
        app,
        "region",
      ],
    },
    workgroupName: {
      propDefinition: [
        app,
        "workgroupName",
        ({ region }) => ({
          region,
        }),
      ],
    },
    database: {
      propDefinition: [
        app,
        "database",
        ({
          region, workgroupName,
        }) => ({
          region,
          workgroupName,
        }),
      ],
    },
    schemaPattern: {
      type: "string",
      label: "Schema",
      description: "Only list tables in schemas matching this name or SQL `LIKE` pattern, e.g. `public`. Leave empty to list tables in all schemas.",
      optional: true,
    },
    tablePattern: {
      type: "string",
      label: "Table Pattern",
      description: "Only list tables matching this SQL `LIKE` pattern, e.g. `order%`. Leave empty to list all tables.",
      optional: true,
    },
    maxItems: props.maxItems,
    nextToken: props.nextToken,
  },
  async run({ $ }) {
    const result = await collectPages(async (token) => {
      const {
        Tables, NextToken,
      } = await this.app.listTables({
        region: this.region,
        WorkgroupName: this.workgroupName,
        Database: this.database,
        SchemaPattern: this.schemaPattern || undefined,
        TablePattern: this.tablePattern || undefined,
        NextToken: token,
      });
      return {
        items: (Tables ?? []).map(({
          name, schema, type,
        }) => ({
          name,
          schema,
          type,
        })),
        nextToken: NextToken,
      };
    }, this.maxItems, this.nextToken);
    $.export("$summary", listSummary("table", result));
    return listResult("tables", result);
  },
};
