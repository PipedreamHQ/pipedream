import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-get-my-company",
  name: "Get My Company",
  description: "Gets info about a company. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/companyinfo)",
  version: "0.1.4",
  type: "action",
  props: {
    quickbooks,
  },
  async run({ $ }) {

    const response = await this.quickbooks.getMyCompany({
      $,
    });

    if (response) {
      $.export("summary", `Successfully retrieved company with id ${response.CompanyInfo.Id}`);
    }

    return response;
  },
};
