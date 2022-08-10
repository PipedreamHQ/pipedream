import notion from "@notionhq/client";
import NOTION_META from "./common/notion-meta-selection.mjs";

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
        const options = this._extractDatabaseTitleOptions(response.results);
        return this._buildPaginatedOptions(options, response.next_cursor);
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
        const options = this._extractPageTitleOptions(response.results);
        return this._buildPaginatedOptions(options, response.next_cursor);
      },
    },
    propertyId: {
      type: "string",
      label: "Property ID",
      description: "The identifier for a Notion page property",
      async options({ pageId }) {
        const response = await this.retrievePage(pageId);

        const parentType = response.parent.type;
        try {
          const { properties } = parentType === "database_id"
            ? await this.retrieveDatabase(response.parent.database_id)
            : response;

          const propEntries = Object.entries(properties);
          const propIds  = propEntries.length === 1 && Object.values(propEntries)[0][1].id === "title"
            ?
            propEntries.map((prop) => ({
              label: prop[1].type,
              value: prop[1].id,
            }))
            : propEntries.map((prop) => ({
              label: prop[1].name,
              value: prop[1].id,
            }));
          return propIds;
        } catch (error) {
          console.log(error);
          return [];
        }
      },
    },
    metaTypes: {
      type: "string[]",
      label: "Meta Types",
      description: "Select the page attributes such as icon and cover",
      options: Object.keys(NOTION_META),
      optional: true,
      reloadProps: true,
    },
    propertyTypes: {
      type: "string[]",
      label: "Property Types",
      description: "Select the page properties",
      optional: true,
      reloadProps: true,
      async options({
        parentId, parentType,
      }) {
        try {
          const { properties } = parentType === "database"
            ? await this.retrieveDatabase(parentId)
            : await this.retrievePage(parentId);
          return Object.keys(properties);
        } catch (error) {
          console.log(error);
          return [];
        }
      },
    },
    archived: {
      type: "boolean",
      label: "Archive page",
      description: "Set to true to archive (delete) a page. Set to false to un-archive\
(restore) a page.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Page Title",
      description: "The page title. Defaults to `Untitled`.",
      optional: true,
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
        notionVersion: "2022-02-22",
      });
    },
    _extractDatabaseTitleOptions(databases) {
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
    _extractPageTitleOptions(pages) {
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
    _buildPaginatedOptions(options, nextPageParameters) {
      return {
        options,
        context: {
          nextPageParameters,
        },
      };
    },
    extractDatabaseTitle(database) {
      return this._extractDatabaseTitleOptions([
        database,
      ])[0].label;
    },
    extractPageTitle(page) {
      return this._extractPageTitleOptions([
        page,
      ])[0].label;
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
    async retrieveDatabase(databaseId) {
      return this._getNotionClient().databases.retrieve({
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
    async retrievePagePropertyItem(pageId, propertyId) {
      return this._getNotionClient().pages.properties.retrieve({
        page_id: pageId,
        property_id: propertyId,
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
