const common = require("../common");
const { notion } = common.props;
const get = require("lodash/get");

module.exports = {
  ...common,
  key: "notion-new-database",
  name: "New Database",
  description: "Emits an event when a new database is created.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    notion,
    pageId: {
      propDefinition: [
        notion,
        "pageId",
      ],
      description: "Unique identifier of the page to watch for new databases.",
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      let startCursor = null;
      let sampleEmmitted = false;
      const databases = [];
      let notionItems;
      do {
        notionItems = await this.notion.searchItems(
          null,
          null,
          this.getFilter(),
          startCursor,
          100,
        );
        const hasResults = get(notionItems, [
          "results",
          "length",
        ]);
        if (!hasResults) {
          break;
        }
        notionItems.results.forEach((result) => databases.push(result));
        if (!sampleEmmitted) {
          const watchFolderDbs = databases.filter( (database) => this.isWatchFolderChild(database));
          const sampleDatabases = watchFolderDbs.slice(0, 10);
          if (sampleDatabases.length > 0) {
            sampleDatabases.forEach(this.emitNotionEvent);
            sampleEmmitted = true;
          }
        }
        if (notionItems.next_cursor) {
          startCursor = notionItems.next_cursor;
          this.db.set("startCursor", startCursor);
        }
      } while (notionItems.has_more);
    },
  },
  methods: {
    ...common.methods,
    getFilter() {
      return {
        property: "object",
        value: "database",
      };
    },
    generateEventMetadata(notionEvent) {
      const databaseTitle = this.notion._getDatabaseTitle(notionEvent);
      const summary = databaseTitle
        ? `New database "${databaseTitle}" was created`
        : "New database was created.";
      return {
        id: notionEvent.id,
        summary,
        ts: notionEvent.created_time,
      };
    },
    isWatchFolderChild(database) {
      return database.parent.page_id === this.pageId;
    },
  },
  async run() {
    const databases = [];
    let notionItems;
    do {
      notionItems = await this.notion.searchItems(
        null,
        null,
        this.getFilter(),
        this.db.get("startCursor"),
        100,
      );
      const hasResults = get(notionItems, [
        "results",
        "length",
      ]);
      if (!hasResults) {
        break;
      }
      notionItems.results.forEach((result) => databases.push(result));
      const watchFolderDbs = databases.filter( (database) => this.isWatchFolderChild(database));
      watchFolderDbs.forEach(this.emitNotionEvent);
      if (notionItems.next_cursor) {
        this.db.set("startCursor", notionItems.next_cursor);
      }
    } while (notionItems.has_more);
  },
};
