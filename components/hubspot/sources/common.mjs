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
      this._setProperties(properties);
    },
  },
  methods: {
    _getAfter() {
      return this.db.get("after") || Date.parse(monthAgo());
    },
    _setAfter(after) {
      this.db.set("after", after);
    },
    _getProperties() {
      return this.db.get("properties");
    },
    _setProperties(properties) {
      this.db.set("properties", properties);
    },
    async paginate(params, resourceFn, resultType = null, after = null) {
      let results = null;
      while (!results || params.after) {
        results = await resourceFn(params);
        if (results.paging) {
          params.after = results.paging.next.after;
        } else {
          delete params.after;
        }
        if (resultType) {
          results = results[resultType];
        }
        for (const result of results) {
          if (this.isRelevant(result, after)) {
            this.emitEvent(result);
          } else {
            return;
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
      limitRequest = null,
    ) {
      let hasMore = true;
      let results, items;
      let count = 0;
      while (hasMore && (!limitRequest || count < limitRequest)) {
        count++;
        results = await resourceFn(params);
        hasMore = results.hasMore;
        if (hasMore) {
          params.offset = results.offset;
        }
        if (resultType) {
          items = results[resultType];
        } else {
          items = results;
        }
        for (const item of items) {
          if (this.isRelevant(item, after)) this.emitEvent(item);
        }
      }
    },
    emitEvent(result) {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    },
    isRelevant() {
      return true;
    },
    getParams() {
      throw new Error("getParams not implemented");
    },
    processResults() {
      throw new Error("processResults not implemented");
    },
    async searchCRM(params, after) {
      await this.paginate(
        params,
        this.hubspot.searchCRM.bind(this),
        "results",
        after,
      );
    },
  },
  async run() {
    const after = this._getAfter();
    const params = this.getParams(after);
    await this.processResults(after, params);
    this._setAfter(Date.now());
  },
};
