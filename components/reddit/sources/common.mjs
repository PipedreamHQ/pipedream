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
      return this.db.get("cache") || [];
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
    isBeforeValid() {
      throw new Error("isBeforeValid is not implemented");
    },
    async validateBefore(cache, before) {
      if (!before) {
        return;
      }
      let valid;
      do {
        valid = await this.isBeforeValid(before);
        if (!valid) {
          before = cache.length > 1
            ? cache[cache.length - 2]
            : null;
          cache.pop();
        }
      } while (!valid);
      this._setBefore(before);
      this._setCache(cache);
    },
    emitRedditEvent(redditEvent) {
      const metadata = this.generateEventMetadata(redditEvent);
      this.$emit(redditEvent, metadata);
    },
  },
};
