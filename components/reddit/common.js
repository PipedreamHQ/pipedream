const reddit = require("./reddit.app");
const get = require("lodash.get");

module.exports = {
  dedupe: "unique",
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
    async emitRedditEvent(reddit_event) {
      const metadata = this.generateEventMetadata(reddit_event);
      this.$emit(reddit_event, metadata);
    },
    wereThingsPulled(reddit_things) {
      const things = get(reddit_things, "data.children");
      return things && things.length;
    },
    did4xxErrorOccur(err) {
      const status = get(err, "response.status");
      return status && status >= 400;
    },
  },
};
