import opensea from "../../opensea.app.mjs";

export default {
  name: "New Collection Events",
  version: "0.0.1",
  key: "opensea-new-collection-events",
  description: "Emit new filtered events. [See docs](https://docs.opensea.io/reference/retrieving-asset-events)",
  dedupe: "greatest",
  type: "source",
  props: {
    opensea,
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
  async run() {
    const eventType = this.eventType === "sales"
      ? "successful"
      : "created";
    const resp = await this.opensea.retrieveEvents({
      contract: this.contractAddress,
      eventType,
    });
    resp.asset_events.forEach((event) => {
      this.$emit(event, {
        id: event.id,
        summary: `${event.asset.name} ${this.eventType} event`,
        ts: +new Date(event.created_date),
      });
    });
  },
};
