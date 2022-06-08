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
      description: "Emoji",
      optional: true,
      options: constants.ICON_TYPES,
    },
    coverType: {
      type: "string",
      label: "Cover Type",
      description: "External URL",
      optional: true,
      options: constants.COVER_TYPES,
    },
    blockTypes: {
      type: "string[]",
      label: "Block Types",
      description: "The block object represents content within Notion. Blocks can be text, lists, media, and more. A page is also a type of block.",
      options: Object.keys(constants.BLOCK_TYPES),
    },
    userIds: {
      type: "string[]",
      label: "Users",
      description: "A list of users",
      async options() {
        const users = await this.getUsers();

        return users.map((user) => ({
          label: user.name,
          value: user.id,
        }));
      },
    },
  },
  methods: {
    _getNotionClient() {
      return new notion.Client({
        auth: this.$auth.oauth_access_token,
      });
    },
    extractDatabaseTitleOptions(databases) {
      return databases.map((database) => {
        const title = database.title
          .map((title) => title.plain_text)
          .filter((title) => title.length > 0)
          .reduce((prev, next) => prev + next, "");
        return {
          label: title || "Untitled",
          value: database.id,
        };
      });
    },
    extractPageTitleOptions(pages) {
      return pages.map((page) => {
        const propertyFound = Object.values(page.properties)
          .find((property) => property.type === "title" && property.title.length > 0);
        const title = propertyFound?.title
          .map((title) => title.plain_text)
          .filter((title) => title.length > 0)
          .reduce((prev, next) => prev + next, "");
        return {
          label: title || "Untitled",
          value: page.id,
        };
      });
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
    async queryDatabase(databaseId, params = {}) {
      return this._getNotionClient().databases.query({
        database_id: databaseId,
        ...params,
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
    /**
     * This generator function scans the pages in a database yields each page
     * separately.
     *
     * @param {string} databaseId - The database containing the pages to scan
     * @param {object} [opts] - Options to customize the operation
     * @yield {object} The next page
     */
    async *getPages(databaseId, opts = {}) {
      let cursor;

      do {
        const params = {
          ...opts,
          start_cursor: cursor,
        };
        const response = await this.queryDatabase(databaseId, params);
        const {
          results: pages,
          next_cursor: nextCursor,
        } = response;

        for (const page of pages) {
          yield page;
        }

        cursor = nextCursor;

      } while (cursor);
    },
    async appendBlock(parentId, blocks) {
      return this._getNotionClient().blocks.children.append({
        block_id: parentId,
        children: blocks,
      });
    },
    async retrieveBlock(blockId) {
      return this._getNotionClient().blocks.retrieve({
        block_id: blockId,
      });
    },
    async retrieveBlockChildren(block, params = {}) {
      const children = [];
      if (!block.has_children) return children;

      do {
        const {
          results,
          next_cursor: nextCursor,
        } = await this.listBlockChildren(block.id, params);

        children.push(...results);
        params.next_cursor = nextCursor;
      } while (params.next_cursor);

      (await Promise.all(children.map((child) => this.retrieveBlockChildren(child))))
        .forEach((c, i) => {
          children[i].children = c;
        });

      return children;
    },
    async listBlockChildren(blockId, params) {
      return this._getNotionClient().blocks.children.list({
        ...params,
        block_id: blockId,
      });
    },
    async getUsers() {
      const response = await this._getNotionClient().users.list();

      return response.results;
    },
  },
};
