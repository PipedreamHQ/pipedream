import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-company",
  name: "Get Company",
  description: "Retrieves a single company (account) by ID from Upsales. [See the documentation](https://api.upsales.com/#07e5839b-2043-4d89-97c3-61be8b8ffe93)",
  version: "0.0.1",
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
    },
  },
  async run({ $ }) {
    const response = await this.app.getCompany({
      $,
      companyId: this.companyId,
    });

    $.export("$summary", `Successfully retrieved company: ${response.name || this.companyId}`);
    return response;
  },
};

