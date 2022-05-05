import { monthAgo } from "../common/utils.mjs";
import hubspot from "../hubspot.app.mjs";

export default {
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
  hooks: {
    async deploy() {
      // By default, only a limited set of properties are returned from the API.
      // Get all possible contact properties to request for each contact.
      const properties = await this.hubspot.createPropertiesArray();
      this.db.set("properties", properties);
    },
  },
  methods: {
    _getAfter() {
      return this.db.get("after") || Date.parse(monthAgo());
    },
    _setAfter(after) {
      this.db.set("after", after);
    },
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
      after = null,
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
    emitEvent(result) {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    },
    isRelevant(/* result, after */) {
      return true;
    },
  },
};
