import notion from "@notionhq/client";
import common from "./actions/common.mjs";

export default {
  type: "app",
  app: "notion",
  propDefinitions: {
    pageId: {
      type: "string",
      label: "Page ID",
      description: "The identifier for a Notion page",
      async options({ prevContext }) {
        const response = await this.searchPage(undefined, {
          start_cursor: prevContext.nextPageParameters ?? undefined,
        });

        const options = response.results.map((page) => {
          let title = Object.values(page.properties)
            .map((property) => {
              if (property.type === "title" && property.title.length > 0) {
                return property.title
                  .map((title) => title.plain_text)
                  .filter((title) => title.length > 0)
                  .reduce((prev, next) => prev + next);
              }
            })
            .filter((title) => title);
          return {
            label: title[0] ?? "Untitled",
            value: page.id,
          };
        });

        return {
          options,
          context: {
            nextPageParameters: response.next_cursor,
          },
        };
      },
    },
    title: {
      type: "string",
      label: "Page Title",
      description: "The words contained in the page title to search for. Leave blank to list all pages",
      optional: true,
    },
    iconType: {
      type: "string",
      label: "Icon Type",
      description: "Text or Emoji",
      optional: true,
      reloadProps: true,
      options: [
        "text",
        "emoji",
      ],
    },
    coverType: {
      type: "string",
      label: "Cover Type",
      description: "External or File URL",
      optional: true,
      reloadProps: true,
      options: [
        "external",
        "file",
      ],
    },
    blockType: {
      type: "string",
      label: "Block Type",
      description: "The block object represents content within Notion. Blocks can be text, lists, media, and more. A page is also a type of block.",
      options: Object.keys(common.blockType),
      reloadProps: true,
    },
  },
  methods: {
    _getNotionClient() {
      return new notion.Client({
        auth: this.$auth.oauth_access_token,
      });
    },
    async createPage(page) {
      return await this._getNotionClient().pages.create(page);
    },
    async retrievePage(pageId) {
      return await this._getNotionClient().pages.retrieve({
        page_id: pageId,
      });
    },
    async searchPage(title, params = {}) {
      return await this._getNotionClient().search({
        query: title,
        filter: {
          property: "object",
          value: "page",
        },
        ...params,
      });
    },
    async updatePage(pageId, params) {
      return await this._getNotionClient().pages.update({
        page_id: pageId,
        ...params,
      });
    },
    async appendBlock(parentId, block) {
      return await this._getNotionClient().blocks.children.append({
        block_id: parentId,
        children: [
          block,
        ],
      });
    },
    async retrieveBlock(blockId, retrieveChildren) {
      const block = await this._getNotionClient().blocks.retrieve({
        block_id: blockId,
      });

      if (retrieveChildren) {
        await this.retrieveBlockChildren(block);
      }

      return block;
    },
    async retrieveBlockChildren(block) {
      if (!block.has_children) {
        block.children = [];
        return;
      }

      block.children = (await this._getNotionClient().blocks.children.list({
        block_id: block.id,
      })).results;

      await Promise.all(
        block.children.map(async (child) => await this.retrieveBlockChildren(child)),
      );
    },
  },
};
