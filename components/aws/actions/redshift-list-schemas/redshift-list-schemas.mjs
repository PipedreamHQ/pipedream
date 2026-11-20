import app from "../../aws.app.mjs";
import {
  collectPages, listResult, listSummary,
} from "../../common/list-paging.mjs";

export default {
  key: "aws-redshift-list-schemas",
  name: "Redshift - List Schemas",
  description: "Lists the schemas in a Redshift database, optionally only those matching a pattern. Use it to find the `schema` for **Redshift - List Tables** and the other Redshift actions; run **Redshift - List Workgroups** and **Redshift - List Databases** first for the workgroup and database. Check `truncated` first: when it is `true`, call again with `nextToken` set to the returned `nextToken`. Example result: `{ \"truncated\": false, \"nextToken\": null, \"count\": 2, \"schemas\": [\"public\", \"sales\"] }`. [See the documentation](https://docs.aws.amazon.com/redshift-data/latest/APIReference/API_ListSchemas.html)",
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
      propDefinition: [
        app,
        "schemaPattern",
      ],
    },
    maxItems: {
      propDefinition: [
        app,
        "maxItems",
      ],
    },
    nextToken: {
      propDefinition: [
        app,
        "nextToken",
      ],
    },
  },
  async run({ $ }) {
    const result = await collectPages(async (token) => {
      const {
        Schemas, NextToken,
      } = await this.app.listSchemas({
        region: this.region,
        WorkgroupName: this.workgroupName,
        Database: this.database,
        SchemaPattern: this.schemaPattern || undefined,
        NextToken: token,
      });
      return {
        items: Schemas ?? [],
        nextToken: NextToken,
      };
    }, this.maxItems, this.nextToken);
    $.export("$summary", listSummary("schema", result));
    return listResult("schemas", result);
  },
};
