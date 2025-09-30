import keboola from "../../keboola.app.mjs";

export default {
  key: "keboola-retrieve-bucket-tables",
  name: "List Tables In Bucket",
  description: "Lists all tables in a specified bucket. [See the documentation](https://keboola.docs.apiary.io/#reference/tables/create-or-list-tables/tables-in-bucket)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    keboola,
    bucketId: {
      propDefinition: [
        keboola,
        "bucketId",
      ],
    },
  },
  async run({ $ }) {
    const tables = await this.keboola.listTablesInBucket({
      $,
      bucketId: this.bucketId,
    });
    $.export("$summary", `Successfully retrieved ${tables.length} tables from bucket ${this.bucketId}.`);
    return tables;
  },
};
