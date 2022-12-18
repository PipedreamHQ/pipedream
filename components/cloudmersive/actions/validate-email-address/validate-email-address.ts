import { defineAction } from "@pipedream/types";
import cloudmersive from "../../app/cloudmersive.app";
import { DOCS } from "../../common/constants";

export default defineAction({
  name: "Get Business Details",
  description: `Get details about a business [See docs here](${DOCS.validateEmailAddress})`,
  key: "cloudmersive-validate-email-address",
  version: "0.0.1",
  type: "action",
  props: {
    cloudmersive,
  },
  async run({ $ }) {
    const params = {
      $,
    };

    const response = await this.cloudmersive.validateEmailAddress(params);

    $.export("$summary", response);

    return response;
  },
});
