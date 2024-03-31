import app from "../../beebole_app.app.mjs";

export default {
  key: "beebole_app-update-company",
  name: "Update a Company",
  description: "Updates a company's details in Beebole. [See the documentation](https://beebole.com/help/api/#update-a-company)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
    },
    companyName: {
      propDefinition: [
        app,
        "companyName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.manageCompanies({
      $,
      data: {
        service: "company.update",
        company: {
          id: this.companyId,
          name: this.companyName,
        },
      },
    });

    $.export("$summary", `Updated company ${this.companyName} successfully`);

    return response;
  },
};
