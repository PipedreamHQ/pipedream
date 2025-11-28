import app from "../../tomba.app.mjs";

export default {
  key: "tomba-technology",
  name: "Get Technology",
  description:
    "Retrieve the technologies used by a specific domain. [See the documentation](https://tomba.io/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    const response = await this.app.getTechnology({
      $,
      domain: this.domain,
    });

    $.export(
      "$summary",
      `Successfully retrieved technology stack for domain: ${this.domain}`,
    );
    return response;
  },
};
