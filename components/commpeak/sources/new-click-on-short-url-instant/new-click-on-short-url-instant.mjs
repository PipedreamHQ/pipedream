import commpeak from "../../commpeak.app.mjs";

export default {
  key: "commpeak-new-click-on-short-url-instant",
  name: "New Click on Short URL (Instant)",
  description: "Emit new event when a short URL link is clicked.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    commpeak,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    specificUrl: {
      propDefinition: [
        commpeak,
        "specificUrl",
      ],
    },
    clickCountLimit: {
      propDefinition: [
        commpeak,
        "clickCountLimit",
        (c) => ({
          specificUrl: c.specificUrl,
        }),
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Since there's no specific endpoint or prop requirement to monitor URL clicks directly,
      // this is a placeholder for initialization logic.
      // In a real scenario, this might involve setting up a webhook or similar mechanism.
    },
  },
  async run() {
    // Placeholder logic for polling a hypothetical endpoint that tracks URL clicks.
    // Since the actual API for tracking URL clicks isn't specified or might not exist,
    // this demonstrates a pattern for emitting an event based on a condition or new data.

    // Example: Fetching the latest click data
    // (this is hypothetical and needs to be replaced with actual logic)
    const { data: clicksData } = await this.commpeak.customAPIRequest({
      apiEndpoint: "/trackClicks", // This is a hypothetical endpoint
      apiData: {}, // Assuming no specific data is needed for the request
    });

    // Assuming clicksData contains an array of click events with timestamps
    clicksData.forEach((click) => {
      const clickTimestamp = new Date(click.timestamp).getTime();
      const lastTimestamp = this.db.get("lastTimestamp") || 0;

      if (clickTimestamp > lastTimestamp) {
        this.$emit(click, {
          id: click.id, // Assuming each click event has a unique ID
          summary: `New click on URL: ${click.url}`, // Summarize the event for better visibility in Pipedream
          ts: clickTimestamp, // Use the event's timestamp
        });

        this.db.set("lastTimestamp", clickTimestamp);
      }
    });
  },
};
