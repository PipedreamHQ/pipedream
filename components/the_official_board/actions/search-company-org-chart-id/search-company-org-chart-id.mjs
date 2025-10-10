import app from "../../the_official_board.app.mjs";

export default {
  key: "the_official_board-search-company-org-chart-id",
  name: "Search Company Org Chart ID",
  description: "Search for company org chart identifier. [See the documentation](https://rest.theofficialboard.com/rest/api/doc/#/Companies/get_company_search)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company to search for",
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "Amount of search results",
      max: 50,
    },
  },
  async run({ $ }) {
    const response = await this.app.getCompanySearch({
      $,
      params: {
        companyName: this.companyName,
        amount: this.amount,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.length} companies with name ${this.companyName}`);
    return response;
  },
};
