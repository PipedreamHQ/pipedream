import app from "../../contactout.app.mjs";

export default {
  key: "contactout-get-company-info",
  name: "Get Company Information",
  description: "Get company information from domain names. [See the documentation](https://api.contactout.com/#company-information-from-domains).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    domains: {
      type: "string[]",
      label: "Company Domains",
      description: "An array of domain names (max 30). Each domain should be in a valid format, for example: example.com",
    },
  },
  async run({ $ }) {
    const response = await this.app.getCompanyInfo({
      $,
      data: {
        domains: this.domains,
      },
    });

    $.export("$summary", "Successfully retrieved company information");
    return response;
  },
};
