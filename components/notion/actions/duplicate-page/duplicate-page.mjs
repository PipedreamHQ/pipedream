import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...base,
  key: "notion-duplicate-page",
  name: "Duplicate Page",
  description: "Creates a new page copied from an existing page block. [See the docs](https://developers.notion.com/reference/post-page)",
  //version: "0.0.1",
  version: "0.0.18",
  type: "action",
  props: {
    notion,
    pageId: {
      propDefinition: [
        notion,
        "pageId",
      ],
      description: "The page to copy",
    },
    title: {
      propDefinition: [
        notion,
        "title",
      ],
    },
    parentId: {
      propDefinition: [
        notion,
        "pageId",
      ],
      label: "Parent Page ID",
      description: "The parent page of the new page being created",
    },
  },
  async run({ $ }) {
    const block = await this.notion.retrieveBlock(this.pageId);
    const blockChildren = await this.notion.retrieveBlockChildren(block);

    const children = await this.getFormattedBlocks(blockChildren);

    const page = {
      parent: {
        page_id: this.parentId,
      },
      properties: this.title
        ? {
          title: utils.buildTextProperty(this.title),
        }
        : {},
      children,
    };

    const results = await this.notion.createPage(page);
    const pageTitle = results?.properties?.title?.title[0]?.plain_text || results.id;
    $.export("$summary", `Successfully created the new page, "${pageTitle}"`);
    return results;
  },
};
