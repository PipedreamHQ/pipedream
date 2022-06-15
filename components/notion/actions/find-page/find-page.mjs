import notion from "../../notion.app.mjs";

export default {
  key: "notion-find-page",
  name: "Find a Page",
  description: "Searches for a page by its title. [See the docs](https://developers.notion.com/reference/post-search)",
  version: "0.0.2",
  type: "action",
  props: {
    notion,
    title: {
      propDefinition: [
        notion,
        "title",
      ],
      description: "The words contained in the page title to search for. Leave blank to list all pages",
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
