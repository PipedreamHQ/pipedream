const hubspot = require("../hubspot.app.js");

module.exports = {
  props: {
    hubspot,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    async paginate(params, resourceFn, resultType = null, after = null) {
      let results = null;
      let done = false;
      while ((!results || params.after) && !done) {
        results = await resourceFn(params);
        if (results.paging) params.after = results.paging.next.after;
        else delete params.after;
        if (resultType) results = results[resultType];
        for (const result of results) {
          if (this.isRelevant(result, after)) {
            this.emitEvent(result);
          } else {
            done = true;
          }
        }
      }
    },
    // pagination for endpoints that return hasMore property of true/false
    async paginateUsingHasMore(
      params,
      resourceFn,
      resultType = null,
      after = null
    ) {
      let hasMore = true;
      let results, items;
      while (hasMore) {
        results = await resourceFn(params);
        hasMore = results.hasMore;
        if (hasMore) params.offset = results.offset;
        if (resultType) items = results[resultType];
        else items = results;
        for (const item of items) {
          if (this.isRelevant(item, after)) this.emitEvent(item);
        }
      }
    },
  },
};