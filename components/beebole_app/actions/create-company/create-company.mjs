import app from "../../beebole_app.app.mjs";

export default {
  key: "beebole_app-create-company",
  name: "Create Company",
  description: "Creates a new company in Beebole. [See the documentation](https://beebole.com/help/api/#create-a-company)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
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
        service: "company.create",
        company: {
          name: this.companyName,
        },
      },
    });

    $.export("$summary", `Successfully created company "${this.companyName}"`);

    return response;
  },
};
