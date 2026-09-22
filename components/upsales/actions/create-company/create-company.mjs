import app from "../../upsales.app.mjs";

export default {
  key: "upsales-create-company",
  name: "Create Company",
  description: "Creates a new company (account) in Upsales. [See the documentation](https://api.upsales.com/#3e8b5e8d-3f4a-4e8e-8b5e-8d3f4a4e8e8b)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "companyName",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "companyPhone",
      ],
    },
    users: {
      propDefinition: [
        app,
        "userId",
      ],
      type: "string[]",
      label: "Users",
      description: "Select one or more users to associate with this company",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createCompany({
      $,
      data: {
        name: this.name,
        phone: this.phone,
        users: this.users,
      },
    });

    $.export("$summary", `Successfully created company: ${this.name}`);
    return response;
  },
};

