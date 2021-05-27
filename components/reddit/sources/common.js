const reddit = require("../reddit.app");

module.exports = {
  props: {
    reddit,
    db: "$.service.db",
    timer: {
      label: "Polling schedule",
      description: "Pipedream polls Reddit for events on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // by default, run every 15 minutes.
      }
    }
  },
  methods: {
    emitRedditEvent(redditEvent) {
      const metadata = this.generateEventMetadata(redditEvent);
      this.$emit(redditEvent, metadata);
    }
  },
};
