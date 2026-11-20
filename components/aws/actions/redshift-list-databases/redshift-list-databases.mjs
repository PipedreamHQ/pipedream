import app from "../../aws.app.mjs";
import {
  collectPages, listResult, listSummary,
} from "../../common/list-paging.mjs";

export default {
  key: "aws-redshift-list-databases",
  name: "Redshift - List Databases",
  description: "Lists the databases in a Redshift Serverless workgroup. Use it to find the `database` for **Redshift - List Schemas**, **Redshift - List Tables**, **Redshift - Query Database** and the other Redshift actions; run **Redshift - List Workgroups** first for the workgroup name. Check `truncated` first: when it is `true`, call again with `nextToken` set to the returned `nextToken`. Example result: `{ \"truncated\": false, \"nextToken\": null, \"count\": 2, \"databases\": [\"dev\", \"sales\"] }`. [See the documentation](https://docs.aws.amazon.com/redshift-data/latest/APIReference/API_ListDatabases.html)",
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
    connectionDatabase: {
      type: "string",
      label: "Connection Database",
      description: "The database to connect with in order to list the databases. Defaults to `dev`.",
      optional: true,
      default: "dev",
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
        Databases, NextToken,
      } = await this.app.listDatabases({
        region: this.region,
        WorkgroupName: this.workgroupName,
        Database: this.connectionDatabase || "dev",
        NextToken: token,
      });
      return {
        items: Databases ?? [],
        nextToken: NextToken,
      };
    }, this.maxItems, this.nextToken);
    $.export("$summary", listSummary("database", result));
    return listResult("databases", result);
  },
};
