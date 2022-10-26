import reddit from "../reddit.app.mjs";

export default {
  props: {
    reddit,
    db: "$.service.db",
    timer: {
      label: "Polling schedule",
      description: "Pipedream polls Reddit for events on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // by default, run every 15 minutes.
      },
    },
  },
  methods: {
    _getCache() {
      return this.db.get("cache") || {};
    },
    _setCache(cache) {
      this.db.set("cache", cache);
    },
    _getBefore() {
      return this.db.get("before");
    },
    _setBefore(before) {
      this.db.set("before", before);
    },
    _getKeys() {
      return this.db.get("keys") || [];
    },
    _setKeys(keys) {
      this.db.set("keys", keys);
    },
    isBeforeValid() {
      throw new Error("isBeforeValid is not implemented");
    },
    async validateBefore(cache, before, keys) {
      if (!before) {
        return {
          cache,
          keys,
        };
      }
      let valid;
      do {
        valid = await this.isBeforeValid(before, cache);
        if (!valid) {
          delete cache[before];
          before = keys.length > 1
            ? keys[keys.length - 2]
            : null;
          keys.pop();
        }
      } while (!valid && before !== null);
      this._setBefore(before);
      this._setCache(cache);
      this._setKeys(keys);
      return {
        cache,
        keys,
      };
    },
    emitRedditEvent(redditEvent) {
      const metadata = this.generateEventMetadata(redditEvent);
      this.$emit(redditEvent, metadata);
    },
  },
};
