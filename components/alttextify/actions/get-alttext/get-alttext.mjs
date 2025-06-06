import alttextify from "../../alttextify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "alttextify-get-alttext",
  name: "Retrieve Alt Text",
  description: "Retrieve alt text for a previously submitted image using the asset ID or job ID. [See the documentation](https://apidoc.alttextify.net/)",
  version: "0.0.1",
  type: "action",
  props: {
    alttextify,
    jobId: {
      propDefinition: [
        alttextify,
        "jobId",
      ],
      optional: true,
    },
    assetId: {
      propDefinition: [
        alttextify,
        "assetId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      jobId, assetId,
    } = this;
    let response;

    if (jobId) {
      response = await this.alttextify.retrieveAltTextByJobId({
        jobId,
      });
      $.export("$summary", `Successfully retrieved alt text by Job ID: ${jobId}`);
    } else if (assetId) {
      response = await this.alttextify.retrieveAltTextByAssetId({
        assetId,
      });
      $.export("$summary", `Successfully retrieved alt text by Asset ID: ${assetId}`);
    } else {
      throw new Error("Either Job ID or Asset ID must be provided.");
    }

    return response;
  },
};
