import app from "../../tomba.app.mjs";

export default {
  key: "tomba-get-email-format",
  name: "Get Email Format",
  description:
    "Retrieve the email format patterns used by a specific domain. [See the documentation](https://docs.tomba.io/api/finder#email-format)",
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
    const response = await this.app.getEmailFormat({
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
