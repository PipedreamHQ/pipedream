import notion from "@notionhq/client";
import NOTION_META from "./common/notion-meta-selection.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { NotionConverter } from "notion-to-md";
import { DefaultExporter } from "notion-to-md/plugins/exporter";

export default {
  type: "app",
  app: "notion",
  propDefinitions: {
    databaseId: {
      type: "string",
      label: "Database ID",
      description: "Select a database or provide a database ID",
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
      description: "Search for a page or provide a page ID",
      useQuery: true,
      async options({
        query, prevContext,
      }) {
        const response = await this.search(query || undefined, {
          start_cursor: prevContext.nextPageParameters ?? undefined,
          filter: {
            property: "object",
            value: "page",
          },
        });
        const options = this._extractPageTitleOptions(response.results);
        return this._buildPaginatedOptions(options, response.next_cursor);
      },
    },
    pageIdInDatabase: {
      type: "string",
      label: "Page ID",
      description: "Search for a page from the database or provide a page ID",
      useQuery: true,
      async options({
        query, prevContext, databaseId,
      }) {
        this._checkOptionsContext(databaseId, "Database ID");
        const response = await this.queryDatabase(databaseId, {
          query,
          start_cursor: prevContext.nextPageParameters ?? undefined,
        });
        const options = this._extractPageTitleOptions(response.results);
        return this._buildPaginatedOptions(options, response.next_cursor);
      },
    },
    propertyId: {
      type: "string",
      label: "Property ID",
      description: "Select a page property or provide a property ID",
      async options({ pageId }) {
        this._checkOptionsContext(pageId, "Page ID");
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
      description: "Select one or more page attributes (such as icon and cover)",
      options: Object.keys(NOTION_META),
      optional: true,
      reloadProps: true,
    },
    propertyTypes: {
      type: "string[]",
      label: "Property Types",
      description: "Select one or more page properties",
      optional: true,
      async options({
        parentId, parentType,
      }) {
        this._checkOptionsContext(parentId, "Database ID");
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
      label: "Archive Page",
      description: "Set to `true` to archive (delete) a page. Set to `false` to  un-archive (restore) a page",
      optional: true,
    },
    title: {
      type: "string",
      label: "Page Title",
      description: "The page title (defaults to `Untitled`)",
      optional: true,
    },
    userIds: {
      type: "string[]",
      label: "Users",
      description: "Select one or more users, or provide user IDs",
      async options() {
        const users = await this.getUsers();

        return users.map((user) => ({
          label: user.name,
          value: user.id,
        }));
      },
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "The direction to sort by",
      optional: true,
      options: [
        "ascending",
        "descending",
      ],
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The number of items from the full list desired in the response (max 100)",
      default: 100,
      min: 1,
      max: 100,
      optional: true,
    },
    startCursor: {
      type: "string",
      label: "Start Cursor (page_id)",
      description: "Leave blank to retrieve the first page of results. Otherwise, the response will be the page of results starting after the provided cursor",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Page or Database",
      description: "Whether to search for pages or databases",
      optional: true,
      options: [
        "page",
        "database",
      ],
    },
    pageContent: {
      type: "string",
      label: "Page Content",
      description: "The content of the page, using Markdown syntax. [See the documentation](https://www.notion.com/help/writing-and-editing-basics#markdown-and-shortcuts) for more information",
      optional: true,
    },
  },
  methods: {
    _checkOptionsContext(value, name) {
      if (value.match(/{{\s?steps/)) {
        throw new ConfigurationError(`Please use a custom expression to reference a previous value, since you are also using one for \`${name}\``);
      }
    },
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
    async search(title, params = {}) {
      return this._getNotionClient().search({
        query: title,
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
    async retrieveBlockChildren(block, subpagesOnly = false) {
      const params = {};
      const children = [];
      if (!block.has_children) return children;

      do {
        const {
          results,
          next_cursor: nextCursor,
        } = await this.listBlockChildren(block.id, params);

        children.push(...(results.filter((child) => !subpagesOnly || child.type === "child_page")));
        params.next_cursor = nextCursor;
      } while (params.next_cursor);

      (await Promise.all(children.map((child) => this.retrieveBlockChildren(child, subpagesOnly))))
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
    async getPageAsMarkdown(pageId) {
      const client = this._getNotionClient();

      const buffer = {};
      const exporter = new DefaultExporter({
        outputType: "buffer",
        buffer,
      });

      const n2m = new NotionConverter(client).withExporter(exporter);
      await n2m.convert(pageId);

      return Object.values(buffer)[0];
    },
  },
};
