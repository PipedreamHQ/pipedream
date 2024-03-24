import builtwith from "../../builtwith.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "builtwith-get-profile-websites",
  name: "Get Profile Websites",
  description: "Get websites associated with a social media URL. [See the documentation](https://api.builtwith.com/social-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    builtwith,
    socialUrl: {
      propDefinition: [
        builtwith,
        "socialUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.builtwith.getWebsitesAssociatedWithSocialMedia({
      socialUrl: this.socialUrl,
    });

    $.export("$summary", `Successfully retrieved websites associated with the social media URL: ${this.socialUrl}`);
    return response;
  },
};
