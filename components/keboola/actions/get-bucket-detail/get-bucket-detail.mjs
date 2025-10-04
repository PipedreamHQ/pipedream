import keboola from "../../keboola.app.mjs";

export default {
  key: "keboola-get-bucket-detail",
  name: "Get Bucket Detail",
  description: "Get detailed information about a specific bucket in Keboola. [See the documentation](https://keboola.docs.apiary.io/#reference/buckets/manage-bucket/bucket-detail)",
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
    const response = await this.keboola.getBucketDetails({
      $,
      bucketId: this.bucketId,
    });

    $.export("$summary", `Successfully retrieved bucket details for bucket ID: ${this.bucketId}`);
    return response;
  },
};
