import notion from "../../notion.app.mjs";

export default {
  key: "notion-new-database",
  name: "New Database",
  description: "Emit new event when a database is created",
  version: "0.0.1",
  type: "source",
  dedupe: "last",
  props: {
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    notion,
  },
  async run() {
    const response = await this.notion.listDatabases();

    response.results.forEach((database) => {
      const title = this.notion.extractDatabaseTitle(database);

      this.$emit(database, {
        id: database.id,
        summary: `Database added: ${title} - ${database.id}`,
        ts: Date.parse(database.created_time),
      });
    });
  },
};
