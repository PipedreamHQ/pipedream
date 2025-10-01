import keboola from "../../keboola.app.mjs";

export default {
  key: "keboola-retrieve-buckets",
  name: "Retrieve Buckets",
  description: "Lists all buckets in your Keboola project. [See the documentation](https://keboola.docs.apiary.io/#reference/buckets/create-or-list-buckets/list-all-buckets)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    keboola,
  },
  async run({ $ }) {
    const buckets = await this.keboola.listBuckets({
      $,
    });

    $.export("$summary", `Successfully retrieved ${buckets.length} buckets.`);
    return buckets;
  },
};
