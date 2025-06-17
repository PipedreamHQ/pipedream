import keboola from "../../keboola.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "keboola-retrieve-bucket-tables",
  name: "List Tables In Bucket",
  description: "Lists all tables in a specified bucket. [See the documentation](https://keboola.docs.apiary.io/)",
  version: "0.0.{{ts}}",
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
      bucketId: this.bucketId,
    });
    $.export("$summary", `Successfully retrieved ${tables.length} tables from bucket ${this.bucketId}.`);
    return tables;
  },
};
