import app from "../../northflank.app.mjs";

export default {
  key: "northflank-get-domains",
  name: "Get Domains",
  description: "List all domains with pagination. [See the documentation](https://northflank.com/docs/v1/api/domains/list-domains)",
  version: "0.0.16",
  type: "action",
  props: {
    app,
    perPage: {
      propDefinition: [
        app,
        "perPage",
      ],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listDomains({
      per_page: this.perPage,
      page: this.page,
    });

    $.export("$summary", `Retrieved ${response.data.domains.length} domain(s)`);
    return response;
  },
};
