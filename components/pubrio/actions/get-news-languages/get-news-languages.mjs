import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-news-languages",
  name: "Get News Languages",
  description: "Get available news language codes for filtering. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/news/languages)",
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
    const response = await this.pubrio.getNewsLanguages({
      $,
    });
    $.export("$summary", "Successfully retrieved news languages");
    return response;
  },
};
