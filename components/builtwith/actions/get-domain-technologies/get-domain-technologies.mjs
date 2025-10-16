import app from "../../builtwith.app.mjs";

export default {
  key: "builtwith-get-domain-technologies",
  name: "Get Domain Technologies",
  description: "Retrieve the technology information of a website. [See the documentation](https://api.builtwith.com/domain-api)",
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
    const response = await this.app.getWebsiteTechnologies({
      $,
      params: {
        LOOKUP: this.domain,
      },
    });

    if (response.Errors.length) {
      throw new Error(response.Errors[0].Message);
    }

    $.export("$summary", `Retrieved technology information for domain ${this.domain}`);

    return response;
  },
};
