import base from "../common/base.mjs";

export default {
  ...base,
  key: "notion-new-database",
  name: "New Database",
  description: "Emit new event when a database is created",
  version: "0.0.1",
  type: "source",
  dedupe: "last",
  async run() {
    const params = {
      start_cursor: this.getLastCursor(),
    };

    do {
      const response = await this.notion.listDatabases(params);

      response.results.forEach((database) => {
        const title = this.notion.extractDatabaseTitle(database);

        this.$emit(database, {
          id: database.id,
          summary: `Database added: ${title} - ${database.id}`,
          ts: Date.parse(database.created_time),
        });
      });

      params.start_cursor = response.next_cursor;
      if (params.start_cursor) {
        this.setLastCursor(params.start_cursor);
      }
    } while (params.start_cursor);
  },
};
