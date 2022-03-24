import { axios } from "@pipedream/platform";
import opensea from "../../opensea.app.mjs";

export default {
  name: "New OpenSea Collection Events",
  version: "0.0.1",
  key: "opensea-events",
  description: "Emit new filtered OpenSea events",
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
  dedupe: "greatest",
  type: "source",
  methods: {},
  async run({ $ }) {
    const contract = this.contractAddress;
    const eventType = this.eventType === "sales"
      ? "successful"
      : "created";
    const apiKey = this.$auth.opensea.api_key;
    const url = `https://api.opensea.io/api/v1/events?only_opensea=false&asset_contract_address=${contract}&event_type=${eventType}`;
    const resp = await axios($, {
      url,
      headers: {
        "X-API-KEY": apiKey,
      },
    });
    resp.asset_events.forEach((event) => {
      this.$emit(event, {
        id: event.id,
        ts: +new Date(event.created_date),
      });
    });
  },
};
