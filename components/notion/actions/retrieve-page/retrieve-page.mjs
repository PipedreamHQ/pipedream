import notion from "../../notion.app.mjs";

export default {
  key: "notion-retrieve-page",
  name: "Retrieve Page",
  description: "Retrieves a page. [See the docs](https://developers.notion.com/reference/retrieve-a-page)",
  version: "0.0.2",
  type: "action",
  props: {
    notion,
    pageId: {
      propDefinition: [
        notion,
        "pageId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.notion.retrievePage(this.pageId);
    $.export("$summary", "Retrieved page successfully");
    return response;
  },
};
