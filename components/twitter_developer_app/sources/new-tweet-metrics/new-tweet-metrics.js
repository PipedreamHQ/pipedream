const isEqual = require("lodash/isEqual");
const common = require("../common");

module.exports = {
  ...common,
  key: "twitter_developer_app-new-tweet-metrics",
  description: "Emit new event on each new twitter metric",
  type: "source",
  name: "New Tweet Metrics",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    ...common.props,
    tweetIds: {
      type: "string[]",
      label: "Tweet IDs",
      description: "The IDs of the Tweets for which to retrieve metrics",
    },
    onlyChangedMetrics: {
      type: "boolean",
      label: "Only Changed Metrics?",
      description: `
        When enabled, this event source will only emit events if the values of the
        retrieved metrics changed
      `,
      default: false,
    },
    excludePublic: {
      type: "boolean",
      label: "Exclude Public Metrics",
      description: "Exclude public metrics from the emitted events",
      default: false,
    },
    excludeNonPublic: {
      type: "boolean",
      label: "Exclude Non-Public Metrics",
      description: "Exclude non-public metrics from the emitted events",
      default: false,
    },
    excludeOrganic: {
      type: "boolean",
      label: "Exclude Organic Metrics",
      description: "Exclude organic metrics from the emitted events",
      default: false,
    },
  },
  hooks: {
    deactivate() {
      this._setLastMetrics(null);
    },
  },
  methods: {
    ...common.methods,
    _getLastMetrics() {
      return this.db.get("lastmetrics");
    },
    _setLastMetrics(metrics) {
      this.db.set("lastmetrics", metrics);
    },
    _shouldSkipExecution(metrics) {
      return (
        this.onlyChangedMetrics &&
        isEqual(this._getLastMetrics(), metrics)
      );
    },
    generateMeta({
      event,
      metrics,
    }) {
      const { id: tweetId } = metrics;
      const { timestamp: ts } = event;
      const id = `${tweetId}-${ts}`;
      const summary = "New metrics";
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run(event) {
    const metrics = await this.twitter_developer_app.getMetricsForIds({
      tweetIds: this.tweetIds,
      excludePublic: this.excludePublic,
      excludeNonPublic: this.excludeNonPublic,
      excludeOrganic: this.excludeOrganic,
    });

    if (this._shouldSkipExecution(metrics)) {
      console.log("No new metrics found. Skipping...");
      return;
    }

    const meta = this.generateMeta({
      event,
      metrics,
    });
    this.$emit(metrics, meta);

    this._setLastMetrics(metrics);
  },
};
