import notion from "@notionhq/client";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "notion-updated-page-in-database",
  name: "Updated Page in Database",
  description: "Emit new event when a page in a database is updated. To select a specific page, use `Updated Page ID` instead",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  props: {
    notion: {
      type: "app",
      app: "notion",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
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
  },
  methods: {
    _getNotionClient() {
      return new notion.Client({
        auth: this.notion.$auth.oauth_access_token,
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
    _buildPaginatedOptions(options, nextPageParameters) {
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
    isResultNew(result, startTimestamp) {
      return Date.parse(result) > startTimestamp;
    },
    daysAgo(days) {
      return new Date().setDate(new Date().getDate() - days);
    },
    getLastUpdatedTimestamp() {
      return this.db.get("last_edited_time") ?? this.daysAgo(7);
    },
    setLastUpdatedTimestamp(ts) {
      this.db.set("last_edited_time", ts);
    },
    lastUpdatedSortParam(params = {}) {
      return lastSortParam("last_edited_time", params);
    },
  },
  async run() {
    const params = this.lastUpdatedSortParam();
    const lastCheckedTimestamp = this.getLastUpdatedTimestamp();

    const pagesStream = this.getPages(this.databaseId, params);

    for await (const page of pagesStream) {
      if (!this.isResultNew(page.last_edited_time, lastCheckedTimestamp)) {
        break;
      }

      this.$emit(page);

      this.setLastUpdatedTimestamp(Date.parse(page?.last_edited_time));
    }
  },
};

function lastSortParam(timestamp, params = {}) {
  return {
    ...params,
    sorts: [
      {
        timestamp,
        direction: "descending",
      },
    ],
  };
}
