import app from "../../builtwith.app.mjs";

export default {
  key: "builtwith-get-profile-websites",
  name: "Get Profile Websites",
  description: "Get websites associated with a social media URL. [See the documentation](https://api.builtwith.com/social-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getSocialMediaWebsites({
      $,
      params: {
        LOOKUP: this.domain,
      },
    });

    if (response.Errors.length) {
      throw new Error(response.Errors[0].Message);
    }

    $.export("$summary", `Successfully retrieved websites associated with the social media URL: ${this.domain}`);

    return response;
  },
};
