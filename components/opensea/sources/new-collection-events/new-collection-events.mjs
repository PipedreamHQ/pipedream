import opensea from "../../opensea.app.mjs";

export default {
  name: "New Collection Events",
  version: "0.0.2",
  key: "opensea-new-collection-events",
  description:
    "Emit new filtered events. [See docs](https://docs.opensea.io/reference/retrieving-asset-events)",
  dedupe: "greatest",
  type: "source",
  props: {
    opensea,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    contractAddress: {
      type: "string",
      label: "Contract Address",
      description: "Collection contract address",
    },
    eventType: {
      type: "string",
      options: [
        "sales",
        "listings",
      ],
      label: "Event Type",
      description: "OpenSea event type",
    },
  },
  methods: {
    getLastTimestamp() {
      return this.db.get("lastTimestamp");
    },
    setLastTimestamp(ts) {
      this.db.set("lastTimestamp", ts);
    },
  },
  async run() {
    const eventType = this.eventType === "sales"
      ? "successful"
      : "created";
    const lastTimestamp = this.getLastTimestamp();
    let cursor = null;
    do {
      const resp = await this.opensea.retrieveEvents({
        contract: this.contractAddress,
        eventType,
        occurredAfter: lastTimestamp,
        cursor,
      });
      resp.asset_events.forEach((event) => {
        this.$emit(event, {
          id: event.id,
          summary: `${event.asset.name} ${this.eventType} event`,
          ts: +new Date(event.created_date),
        });
      });
      if (!cursor && resp.asset_events.length > 0) {
        const ts = Math.floor(new Date(resp.asset_events[0].created_date).getTime() / 1000);
        this.setLastTimestamp(ts);
      }
      cursor = resp.next;
    } while (lastTimestamp && cursor);
  },
};
