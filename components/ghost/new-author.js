const ghost = require("https://github.com/PipedreamHQ/pipedream/components/ghost/ghost.app.js");

module.exports = {
  name: "New Author",
  description: "Emits an event for each new author added on a site.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ghost,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    let total = 1;
    let page = 1;
    const latestId = this.db.get("latestId") || 0;
    let maxId = 1;

    while (page <= total) {
      let results = await this.ghost.getAuthors(page, latestId);
      total = results.data.meta.pagination.pages;
      for (const result of results.data.authors) {
        this.$emit(result, {
          id: result.id,
          summary: result.name,
          ts: Date.now(),
        });
        if (Number(`0x${result.id.substr(1)}`) > Number(`0x${maxId}`)) maxId = result.id;
      }
      page++;
    }

    if (Number(`0x${maxId}`) > Number(`0x${latestId}`))
      this.db.set("latestId", maxId);
  },
};