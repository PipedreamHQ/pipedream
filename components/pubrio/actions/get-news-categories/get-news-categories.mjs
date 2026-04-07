import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-news-categories",
  name: "Get News Categories",
  description: "Get available news category codes for filtering. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
  },
  async run({ $ }) {
    const response = await this.pubrio.makeRequest({
      $,
      method: "GET",
      url: "/companies/news/categories",
    });
    $.export("$summary", "Successfully retrieved news categories");
    return response;
  },
};
