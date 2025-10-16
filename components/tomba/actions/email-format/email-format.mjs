import app from "../../tomba.app.mjs";

export default {
  key: "tomba-email-format",
  name: "Email Format",
  description:
    "Retrieve the email format patterns used by a specific domain. [See the documentation](https://tomba.io/api)",
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
    const response = await this.app.emailFormat({
      $,
      domain: this.domain,
    });

    $.export(
      "$summary",
      `Successfully retrieved email format patterns for domain: ${this.domain}`,
    );
    return response;
  },
};
