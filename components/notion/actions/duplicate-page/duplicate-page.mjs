import utils from "../../common/utils.mjs";
import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-duplicate-page",
  name: "Duplicate Page",
  description: "Create a new page copied from an existing page block. [See the documentation](https://developers.notion.com/reference/post-page)",
  version: "0.0.22",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    notion,
    pageId: {
      propDefinition: [
        notion,
        "pageId",
      ],
      description: "Select a page to copy or provide a page ID",
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
      description: "Select a parent page for the new page being created, or provide the ID of a parent page",
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
    $.export("$summary", `Successfully created page "[${pageName}](${results.url})"`);
    return results;
  },
};
