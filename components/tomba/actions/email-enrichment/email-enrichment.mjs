import app from "../../tomba.app.mjs";

export default {
  key: "tomba-email-enrichment",
  name: "Email Enrichment",
  description:
    "Look up person and company data based on an email. [See the documentation](https://tomba.io/api)",
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
    const response = await this.app.emailEnrichment({
      $,
      email: this.email,
    });

    $.export("$summary", `Successfully enriched data for email: ${this.email}`);
    return response;
  },
};
