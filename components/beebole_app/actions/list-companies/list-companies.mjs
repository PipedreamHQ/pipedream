import app from "../../beebole_app.app.mjs";

export default {
  key: "beebole_app-list-companies",
  name: "List Companies",
  description: "List all companies in the Beebole platform. [See the documentation](https://beebole.com/help/api/#list-companies)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.manageCompanies({
      $,
      data: {
        service: "company.list",
      },
    });

    $.export("$summary", `Successfully listed ${response.companies.length} companies`);

    return response;
  },
};
