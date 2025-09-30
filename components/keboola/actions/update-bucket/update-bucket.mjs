import keboola from "../../keboola.app.mjs";

export default {
  key: "keboola-update-bucket",
  name: "Update Bucket",
  description: "Updates a bucket with a new display name in Keboola. [See the documentation](https://keboola.docs.apiary.io/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    keboola,
    bucketId: {
      propDefinition: [
        keboola,
        "bucketId",
      ],
      reloadProps: true,
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The new display name for the bucket",
    },
    color: {
      type: "string",
      label: "Color",
      description: "The new color for the bucket. Format: #RRGGBB",
      optional: true,
    },
  },
  async additionalProps(props) {
    if (this.bucketId) {
      const bucket = await this.keboola.getBucketDetails({
        bucketId: this.bucketId,
      });
      props.displayName.default = bucket.displayName;
      props.color.default = bucket.color || "";
    }
    return {};
  },
  async run({ $ }) {
    const response = await this.keboola.updateBucket({
      $,
      bucketId: this.bucketId,
      data: {
        displayName: this.displayName,
        color: this.color,
      },
    });

    $.export("$summary", `Successfully updated bucket with ID ${this.bucketId} to have new display name: "${this.displayName}"`);
    return response;
  },
};
