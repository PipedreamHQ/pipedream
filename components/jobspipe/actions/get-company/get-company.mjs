import app from "../../jobspipe.app.mjs";

export default {
  key: "jobspipe-get-company",
  name: "Get Company",
  description: "Look up one company by domain, careers URL, email, or name. Returns enriched company data including headcount, location, LinkedIn, and more. [See the documentation](https://docs.jobspipe.dev/).",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    key: {
      type: "string",
      label: "Company Key",
      description: "Company domain (e.g. `stripe.com`), careers URL (e.g. `https://careers.walmart.com/jobs`), email (e.g. `andrew@stripe.com`), or exact company name (e.g. `Stripe`). A domain is matched on its registrable form. An ambiguous name returns a 404 with candidate companies.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getCompany({
      $,
      key: this.key,
    });

    $.export("$summary", `Successfully retrieved company: ${response.name ?? this.key}`);
    return response;
  },
};
