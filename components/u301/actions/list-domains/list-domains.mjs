import app from "../../u301.app.mjs";

export default {
  key: "u301-list-domains",
  name: "List Domains",
  description: "List all available domains for URL shortening. [See the documentation](https://docs.u301.com/api-reference/endpoint/list-shorten-domains)",
  version: "0.0.1",
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
      $,
      params: {
        perPage: this.perPage,
        page: this.page,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.data.length} domains`);

    return response;
  },
};
