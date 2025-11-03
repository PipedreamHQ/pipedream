import notion from "../../notion.app.mjs";

export default {
  key: "notion-retrieve-page",
  name: "Retrieve Page Metadata",
  description: "Get details of a page. [See the documentation](https://developers.notion.com/reference/retrieve-a-page)",
  version: "0.0.14",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    notion,
    infoLabel: {
      type: "alert",
      alertType: "info",
      content: "If you need to retrieve page content or block objects, use the **Retrieve Page Content** action instead.",
    },
    pageId: {
      propDefinition: [
        notion,
        "pageId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.notion.retrievePage(this.pageId);
    const title = response?.properties?.Name?.title[0]?.plain_text;
    $.export("$summary", `Successfully retrieved page${title
      ? ` "${title}"`
      : ""}`);
    return response;
  },
};
