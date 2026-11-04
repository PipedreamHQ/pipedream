import utils from "../../common/utils.mjs";
import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

const MAX_CHILDREN_PER_REQUEST = 100;

export default {
  ...base,
  key: "notion-duplicate-page",
  name: "Copy Page From Template",
  description: "Copy an EXISTING page (template) into a new page with a new title. Use this ONLY when the user is reusing the structure of an existing page as a template (e.g. \"copy this offer letter template for a new candidate\"). Do NOT use to create a new page with original content — for that, use **Create Page**. The source page must already exist in Notion and is identified by its page ID. [See the documentation](https://developers.notion.com/reference/post-page)",
  version: "0.0.28",
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
      // Notion accepts at most 100 children per request: create the page with the
      // first batch, then append the remainder in batches of 100.
      children: formattedChildren.slice(0, MAX_CHILDREN_PER_REQUEST),
    };

    const results = await this.notion.createPage(page);
    const batchSize = MAX_CHILDREN_PER_REQUEST;
    for (let i = batchSize; i < formattedChildren.length; i += batchSize) {
      await this.notion.appendBlock(results.id, formattedChildren.slice(i, i + batchSize));
    }
    const pageName = this.notion.extractPageTitle(results);
    $.export("$summary", `Successfully created page "[${pageName}](${results.url})"`);
    return results;
  },
};
