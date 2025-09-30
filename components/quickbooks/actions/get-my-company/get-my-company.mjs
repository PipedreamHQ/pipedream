import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-get-my-company",
  name: "Get My Company",
  description: "Gets info about a company. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/companyinfo)",
  version: "0.1.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    quickbooks,
  },
  async run({ $ }) {
    const response = await this.quickbooks.getMyCompany({
      $,
    });

    if (response) {
      $.export("summary", `Successfully retrieved company with ID ${response.CompanyInfo.Id}`);
    }

    return response;
  },
};
