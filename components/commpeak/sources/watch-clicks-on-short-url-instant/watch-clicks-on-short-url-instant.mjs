import commpeak from "../../commpeak.app.mjs";

export default {
  key: "commpeak-watch-clicks-on-short-url-instant",
  name: "Watch Clicks on Short URL Instant",
  description: "Emit new event when a short URL link is clicked. [See the documentation](https://lookup.api-docs.commpeak.com/?_gl=1*50xs02*_gcl_au*mtmxmzgzmza3ny4xnjk3nty0nde3)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    commpeak,
    db: "$.service.db",
    clickCountLimit: {
      propDefinition: [
        commpeak,
        "clickCountLimit",
      ],
    },
    specificUrl: {
      propDefinition: [
        commpeak,
        "specificUrl",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      // Initialize or fetch any required data upon deployment
    },
  },
  async run() {
    const lastChecked = this.db.get("lastChecked") || 0;
    const now = Date.now();

    // Example API call
    const response = await this.commpeak.customAPIRequest({
      apiEndpoint: "/your-endpoint-here", // Replace with actual endpoint
      apiData: {
        clickCountLimit: this.clickCountLimit,
        specificUrl: this.specificUrl,
        lastChecked,
      },
    });

    // Process and emit events
    response.forEach((clickEvent) => {
      if (clickEvent.timestamp <= lastChecked) return; // Only process new clicks
      this.$emit(clickEvent, {
        id: clickEvent.id || Date.parse(clickEvent.timestamp).toString(),
        summary: `Click on ${clickEvent.url}`,
        ts: Date.parse(clickEvent.timestamp),
      });
    });

    // Update the last checked timestamp
    this.db.set("lastChecked", now);
  },
};
