const ghost = require("https://github.com/PipedreamHQ/pipedream/components/ghost/ghost.app.js");

module.exports = {
  name: "Post Published",
  description: "Emits an event for each new post published on a site.",
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
    const now = new Date();
    const monthAgo = new Date(now.getTime());
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    let lastEvent = this.db.get("lastEvent") || monthAgo;
    lastEvent = new Date(lastEvent);

    let total = 1;
    let page = 1;
    let done = false;

    while (page <= total && !done) {
      let results = await this.ghost.getPosts(page);
      total = results.data.meta.pagination.total;
      for (const result of results.data.posts) {
        let published_at = new Date(result.published_at);
        this.$emit(result, {
          id: result.id,
          summary: result.title,
          ts: published_at.getTime(),
        });
        // results are in reverse chronological order. Once we reach one published before the last event, we can stop.
        if (published_at.getTime() < lastEvent) done = true;
      }
      page++;
    }

    this.db.set("lastEvent", Date.now());
  },
};