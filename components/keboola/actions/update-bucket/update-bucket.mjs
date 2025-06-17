import keboola from "../../keboola.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "keboola-update-bucket",
  name: "Update Bucket",
  description: "Updates a bucket with a new display name in Keboola. [See the documentation](https://keboola.docs.apiary.io/)",
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
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The new display name for the bucket",
    },
  },
  async run({ $ }) {
    const response = await this.keboola.updateBucket({
      bucketId: this.bucketId,
      displayName: this.displayName,
    });

    $.export("$summary", `Successfully updated bucket with ID ${this.bucketId} to have new display name: "${this.displayName}"`);
    return response;
  },
};
