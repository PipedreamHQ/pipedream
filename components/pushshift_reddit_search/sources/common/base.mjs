import pushshift from "../../pushshift_reddit_search.app.mjs";

export default {
  props: {
    pushshift,
    db: "$.service.db",
    timer: {
      label: "Polling schedule",
      description: "Pipedream will poll the Pushshift.io API on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  methods: {
    _getAfter() {
      return this.db.get("after");
    },
    _setAfter(after) {
      this.db.set("after", after);
    },
  },
};
