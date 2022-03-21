// eslint-disable-next-line camelcase
const ghost_org_content_api = require("../../ghost_org_content_api.app.js");

module.exports = {
  type: "source",
  key: "ghost_org_content_api-new-author",
  name: "New Author",
  description: "Emit new event for each new author added on a site.",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ghost_org_content_api,
    db: "$.service.db",
    // eslint-disable-next-line pipedream/props-label,pipedream/props-description
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run() {
    let total = 1;
    let page = 1;

    while (page <= total) {
      let results = await this.ghost_org_content_api.getAuthors(page);
      total = results.data.meta.pagination.pages;
      for (const result of results.data.authors) {
        this.$emit(result, {
          id: result.id,
          summary: result.name,
          ts: Date.now(),
        });
      }
      page++;
    }
  },
};
