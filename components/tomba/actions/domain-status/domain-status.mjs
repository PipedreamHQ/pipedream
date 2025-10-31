import app from "../../tomba.app.mjs";

export default {
  key: "tomba-domain-status",
  name: "Domain Status",
  description:
    "Find domain status if is webmail or disposable. [See the documentation](https://tomba.io/api)",
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
    const response = await this.app.domainStatus({
      $,
      domain: this.domain,
    });

    $.export(
      "$summary",
      `Successfully retrieved domain status for: ${this.domain}`,
    );
    return response;
  },
};
