import app from "../../clearbit.app.mjs";

export default {
  key: "clearbit-company-name-to-domain",
  name: "Company Name to Domain",
  description: "The Company Name to Domain action lets you convert the exact name of a company to a website domain, and a logo. [See the docs here](https://clearbit.com/docs/api/1.0/domains/find).",
  version: "0.1.2",
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
      type: "boolean",
      label: "Handle lack of records found as an error?",
      description: "Defaults to `false`. If no records are found, the step will still be considered a success. If `false`, the step will return an error and workflow execution will stop.",
      optional: true,
      default: false,
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
