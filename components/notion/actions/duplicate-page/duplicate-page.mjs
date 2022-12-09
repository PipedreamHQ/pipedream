import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...base,
  key: "notion-duplicate-page",
  name: "Duplicate Page",
  description: "Creates a new page copied from an existing page block. [See the docs](https://developers.notion.com/reference/post-page)",
  version: "0.0.2",
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
      description: "The new page title",
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
    block.children = await this.notion.retrieveBlockChildren(block);
    const formattedChildren = await this.formatChildBlocks(block);

    const pageBlock = await this.notion.retrievePage(this.pageId);
    const {
      cover, icon,
    } = pageBlock;
    const title = this.title
      ? this.title
      : this.notion.extractPageTitle(pageBlock);

    const page = {
      parent: {
        page_id: this.parentId,
      },
      properties: {
        title: utils.buildTextProperty(title),
      },
      cover: this.isFile(cover)
        ? null
        : cover,
      icon: this.isFile(icon)
        ? null
        : icon,
      children: formattedChildren,
    };

    const results = await this.notion.createPage(page);
    const pageName = this.notion.extractPageTitle(results);
    $.export("$summary", `Successfully created the new page, "[${pageName}](${results.url})"`);
    return results;
  },
};
