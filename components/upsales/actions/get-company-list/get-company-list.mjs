import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-company-list",
  name: "Get Company List",
  description: "Retrieves a list of companies (accounts) from Upsales. [See the documentation](https://api.upsales.com/#a2a0dc79-a473-4ae4-891d-c31333a221d0)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listCompanies({
      $,
      params: {
        limit: this.limit,
        offset: this.offset,
      },
    });

    $.export("$summary", `Successfully retrieved ${response?.data?.length || 0} company(ies)`);
    return response;
  },
};

