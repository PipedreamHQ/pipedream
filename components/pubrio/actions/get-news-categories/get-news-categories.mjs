import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-news-categories",
  name: "Get News Categories",
  description: "Get available news category codes for filtering. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/news/categories)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
  },
  async run({ $ }) {
    const response = await this.pubrio.getNewsCategories({
      $,
    });
    $.export("$summary", "Successfully retrieved news categories");
    return response;
  },
};
