import notion from "../../notion.app.mjs";

export default {
  key: "notion-find-page",
  name: "Find a Page",
  description: "Searches for a page by its title. [See the docs](https://developers.notion.com/reference/post-search)",
  version: "0.0.1",
  type: "action",
  props: {
    notion,
    title: {
      propDefinition: [
        notion,
        "title",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.notion.searchPage(this.title);
    if (this.title) {
      $.export("$summary", `Found ${response.results.length} pages with title search \`${this.title}\``);
    } else {
      $.export("$summary", `Found ${response.results.length} pages`);
    }
    return response;
  },
};
