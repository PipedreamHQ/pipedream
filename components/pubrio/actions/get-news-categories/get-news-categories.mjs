import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-news-categories",
  name: "Get News Categories",
  description: "Get available news category codes for filtering. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    readOnlyHint: true,
    destructiveHint: false,
  },
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
