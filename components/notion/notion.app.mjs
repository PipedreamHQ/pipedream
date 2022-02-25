import notion from "@notionhq/client";
import constants from "./actions/common/constants.mjs";

export default {
  type: "app",
  app: "notion",
  propDefinitions: {
    databaseId: {
      type: "string",
      label: "Database ID",
      description: "The identifier for a Notion database",
      async options({ prevContext }) {
        const response = await this.listDatabases({
          start_cursor: prevContext.nextPageParameters ?? undefined,
        });
        const options = this.extractDatabaseTitleOptions(response.results);
        return this.buildPaginatedOptions(options, response.next_cursor);
      },
    },
    pageId: {
      type: "string",
      label: "Page ID",
      description: "The identifier for a Notion page",
      async options({ prevContext }) {
        const response = await this.searchPage(undefined, {
          start_cursor: prevContext.nextPageParameters ?? undefined,
        });
        const options = this.extractPageTitleOptions(response.results);
        return this.buildPaginatedOptions(options, response.next_cursor);
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
      options: constants.ICON_TYPES,
    },
    coverType: {
      type: "string",
      label: "Cover Type",
      description: "External or File URL",
      optional: true,
      reloadProps: true,
      options: constants.COVER_TYPES,
    },
    blockType: {
      type: "string",
      label: "Block Type",
      description: "The block object represents content within Notion. Blocks can be text, lists, media, and more. A page is also a type of block.",
      options: Object.keys(constants.BLOCK_TYPES),
      reloadProps: true,
    },
  },
  methods: {
    _getNotionClient() {
      return new notion.Client({
        auth: this.$auth.oauth_access_token,
      });
    },
    extractDatabaseTitleOptions(databases) {
      const options = databases.map((database) => {
        const title = database.title
          .map((title) => title.plain_text)
          .filter((title) => title.length > 0)
          .reduce((prev, next) => prev + next);
        return {
          label: title ?? "Untitled",
          value: database.id,
        };
      });
      return options;
    },
    extractPageTitleOptions(pages) {
      const options = pages.map((page) => {
        const propertyFound = Object.values(page.properties)
          .find((property) => property.type === "title" && property.title.length > 0);
        const title = propertyFound?.title
          .map((title) => title.plain_text)
          .filter((title) => title.length > 0)
          .reduce((prev, next) => prev + next);
        return {
          label: title ?? "Untitled",
          value: page.id,
        };
      });
      return options;
    },
    extractDatabaseTitle(database) {
      return this.extractDatabaseTitleOptions([
        database,
      ])[0].label;
    },
    extractPageTitle(page) {
      return this.extractPageTitleOptions([
        page,
      ])[0].label;
    },
    buildPaginatedOptions(options, nextPageParameters) {
      return {
        options,
        context: {
          nextPageParameters,
        },
      };
    },
    async listDatabases(params = {}) {
      return this._getNotionClient().search({
        filter: {
          property: "object",
          value: "database",
        },
        ...params,
      });
    },
    async queryDatabase(databaseId) {
      return this._getNotionClient().databases.query({
        database_id: databaseId,
      });
    },
    async createPage(page) {
      return this._getNotionClient().pages.create(page);
    },
    async retrievePage(pageId) {
      return this._getNotionClient().pages.retrieve({
        page_id: pageId,
      });
    },
    async searchPage(title, params = {}) {
      return this._getNotionClient().search({
        query: title,
        filter: {
          property: "object",
          value: "page",
        },
        ...params,
      });
    },
    async updatePage(pageId, params) {
      return this._getNotionClient().pages.update({
        page_id: pageId,
        ...params,
      });
    },
    async appendBlock(parentId, block) {
      return this._getNotionClient().blocks.children.append({
        block_id: parentId,
        children: [
          block,
        ],
      });
    },
    async retrieveBlock(blockId) {
      return this._getNotionClient().blocks.retrieve({
        block_id: blockId,
      });
    },
    async listBlockChildren(blockId) {
      return this._getNotionClient().blocks.children.list({
        block_id: blockId,
      });
    },
    async retrieveBlockChildren(block) {
      if (!block.has_children) return [];

      const { results: children } = await this.listBlockChildren(block.id);

      (await Promise.all(children.map((child) => this.retrieveBlockChildren(child))))
        .forEach((c, i) => {
          children[i].children = c;
        });

      return children;
    },
  },
};
