import app from "../../the_official_board.app.mjs";

export default {
  key: "the_official_board-get-orgchart-info",
  name: "Get Orgchart Info",
  description: "Get organization chart information for a company. [See the documentation](https://rest.theofficialboard.com/rest/api/doc/#/Companies/get_company_orgchart)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
      description: "The ID of the company to get orgchart for",
    },
  },
  async run({ $ }) {
    const response = await this.app.getCompanyOrgchart({
      $,
      params: {
        id: this.companyId,
      },
    });

    $.export("$summary", `Successfully retrieved orgchart information for company with ID ${this.companyId}`);
    return response;
  },
};
