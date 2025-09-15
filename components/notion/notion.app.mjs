import notion from "@notionhq/client";
import { ConfigurationError } from "@pipedream/platform";
import { NotionToMarkdown } from "notion-to-md";
import NOTION_META from "./common/notion-meta-selection.mjs";

export default {
  type: "app",
  app: "notion",
  propDefinitions: {
    dataSourceId: {
      type: "string",
      label: "Data Source ID",
      description: "Select a data source or provide a data source ID",
      async options({ prevContext }) {
        const response = await this.listDataSources({
          start_cursor: prevContext.nextPageParameters ?? undefined,
        });
        const options = this._extractDataSourceTitleOptions(response.results);
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
    pageIdInDataSource: {
      type: "string",
      label: "Page ID",
      description: "Search for a page from the data source or provide a page ID",
      useQuery: true,
      async options({
        query, prevContext, dataSourceId,
      }) {
        this._checkOptionsContext(dataSourceId, "Data Source ID");
        const response = await this.queryDataSource(dataSourceId, {
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
          const { properties } = parentType === "data_source_id"
            ? await this.retrieveDataSource(response.parent.data_source_id)
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
        this._checkOptionsContext(parentId, "Data Source ID");
        try {
          const { properties } = parentType === "data_source"
            ? await this.retrieveDataSource(parentId)
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
    userId: {
      type: "string",
      label: "User ID",
      description: "Select a user, or provide a user ID",
      async options() {
        const { results: users } = await this.getUsers();

        return users.map((user) => ({
          label: user.name,
          value: user.id,
        }));
      },
    },
    fileUploadId: {
      type: "string",
      label: "File Upload ID",
      description: "The ID of the file upload to send.",
      async options({
        prevContext, status,
      }) {
        const {
          results, next_cursor: nextCursor,
        } = await this.listFileUploads({
          status,
          page_size: 100,
          start_cursor: prevContext.nextPageParameters ?? undefined,
        });

        return {
          options: results.map(({
            id: value, filename: label,
          }) => ({
            label,
            value,
          })),
          context: {
            nextPageParameters: nextCursor,
          },
        };
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
      label: "Page or Data Source",
      description: "Whether to search for pages or data sources.",
      optional: true,
      options: [
        "page",
        "data_source",
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
        notionVersion: "2025-09-03",
      });
    },
    _extractDataSourceTitleOptions(databases) {
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
    extractDataSourceTitle(database) {
      return this._extractDataSourceTitleOptions([
        database,
      ])[0].label;
    },
    extractPageTitle(page) {
      return this._extractPageTitleOptions([
        page,
      ])[0].label;
    },
    async listDataSources(params = {}) {
      return this._getNotionClient().search({
        filter: {
          property: "object",
          value: "data_source",
        },
        ...params,
      });
    },
    async retrieveDataSource(dataSourceId) {
      return this._getNotionClient().dataSources.retrieve({
        data_source_id: dataSourceId,
      });
    },
    async createDatabase(database) {
      return this._getNotionClient().databases.create(database);
    },
    async updateDataSource(database) {
      return this._getNotionClient().dataSources.update(database);
    },
    async queryDataSource(dataSourceId, params = {}) {
      return this._getNotionClient().dataSources.query({
        data_source_id: dataSourceId,
        ...params,
      });
    },
    async createFileUpload(file) {
      return this._getNotionClient().fileUploads.create(file);
    },
    async listFileUploads(params = {}) {
      return this._getNotionClient().fileUploads.list(params);
    },
    async sendFileUpload(file) {
      return this._getNotionClient().fileUploads.send(file);
    },
    async completeFileUpload(file) {
      return this._getNotionClient().fileUploads.complete(file);
    },
    async retrieveFileUpload(params) {
      return this._getNotionClient().fileUploads.retrieve(params);
    },
    async updateBlock(block) {
      return this._getNotionClient().blocks.update(block);
    },
    async deleteBlock(blockId) {
      return this._getNotionClient().blocks.delete({
        block_id: blockId,
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
     * This generator function scans the pages in a data source and yields each page
     * separately.
     *
     * @param {string} dataSourceId - The data source containing the pages to scan
     * @param {object} [opts] - Options to customize the operation
     * @yield {object} The next page
     */
    async *getPages(dataSourceId, opts = {}) {
      let cursor;

      do {
        const params = {
          ...opts,
          start_cursor: cursor,
        };
        const response = await this.queryDataSource(dataSourceId, params);
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
    async getUsers(opts = {}) {
      return this._getNotionClient().users.list(opts);
    },
    async getUser(userId) {
      return this._getNotionClient().users.retrieve({
        user_id: userId,
      });
    },
    async getPageAsMarkdown(pageId, shouldRetrieveChildren) {
      const notion = this._getNotionClient();

      const n2m = new NotionToMarkdown({
        notionClient: notion,
        config: {
          separateChildPage: true,
          parseChildPages: shouldRetrieveChildren,
        },
      });
      const blocks = await n2m.pageToMarkdown(pageId);
      const output = n2m.toMarkdownString(blocks);
      return shouldRetrieveChildren
        ? output
        : output.parent;
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let cursor = null;

      do {
        params.start_cursor = cursor;
        const {
          results,
          next_cursor: nextCursor,
          has_more: hasMoreResults,
        } = await fn({
          params,
          ...opts,
        });

        for (const d of results) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = hasMoreResults;
        cursor = nextCursor;

      } while (hasMore);
    },
  },
};
