import app from "../../tomba.app.mjs";

export default {
  key: "tomba-get-email-count",
  name: "Get Email Count",
  description:
    "Find total email addresses we have for one domain. [See the documentation](https://docs.tomba.io/api/finder#email-count)",
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
    const response = await this.app.getEmailCount({
      $,
      domain: this.domain,
    });

    $.export(
      "$summary",
      `Successfully retrieved email count for domain: ${this.domain}`,
    );
    return response;
  },
};
