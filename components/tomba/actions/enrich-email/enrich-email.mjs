import app from "../../tomba.app.mjs";

export default {
  key: "tomba-enrich-email",
  name: "Enrich Email",
  description:
    "Look up person and company data based on an email. [See the documentation](https://docs.tomba.io/api/finder#email-enrichment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.enrichEmail({
      $,
      email: this.email,
    });

    $.export("$summary", `Successfully enriched data for email: ${this.email}`);
    return response;
  },
};
