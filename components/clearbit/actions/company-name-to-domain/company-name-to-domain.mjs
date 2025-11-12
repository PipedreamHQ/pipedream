import app from "../../clearbit.app.mjs";

export default {
  key: "clearbit-company-name-to-domain",
  name: "Company Name to Domain",
  description: "The Company Name to Domain action lets you convert the exact name of a company to a website domain, and a logo. [See the docs here](https://dashboard.clearbit.com/docs?javascript#name-to-domain-api).",
  version: "0.2.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    companyName: {
      propDefinition: [
        app,
        "companyName",
      ],
    },
    errorIfNoRecords: {
      propDefinition: [
        app,
        "errorIfNoRecords",
      ],
    },
  },
  async run({ $ }) {
    try {
      const res = await this.app.companyNameToDomain($, this.companyName);
      $.export("$summary", "Successfully converted company name to domain.");
      return res;
    } catch (err) {
      if (!this.errorIfNoRecords && err.response?.status == 404) {
        $.export("$summary", "No domain found.");
      } else {
        throw err;
      }
    }
  },
};
