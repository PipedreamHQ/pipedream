import app from "../../linkupapi.app.mjs";

export default {
  type: "action",
  key: "linkupapi-get-company-info",
  name: "Get Company Info",
  description: "Fetch details for a LinkedIn company. [See the documentation](https://docs.linkupapi.com/api-reference/v2/profiles/get-company)",
  version: "1.0.0",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    companyUrl: {
      type: "string",
      label: "LinkedIn Company URL",
      description: "LinkedIn company URL. Eg. `https://www.linkedin.com/company/stripe/`.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getCompanyInfo({
      $,
      accountId: this.accountId,
      params: {
        company_url: this.companyUrl,
      },
    });

    $.export("$summary", `Successfully retrieved company information for ${this.companyUrl}`);
    return response;
  },
};
