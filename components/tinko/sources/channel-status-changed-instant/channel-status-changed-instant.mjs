import common from "../common/base.mjs";
import { CHANNEL_EVENTS } from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "tinko-channel-status-changed-instant",
  name: "New Channel Status Change (Instant)",
  description: "Emit new event when a Tinko channel is connected or loses its connection, for example when a WhatsApp number is logged out. [See the documentation](https://docs.tinko.com.br/webhook/eventos-suportados/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventTypes: {
      type: "string[]",
      label: "Status Changes",
      description: "The status changes to listen for, e.g. `[\"CHANNEL_DISCONNECTED\"]`. One or both of `CHANNEL_CONNECTED` and `CHANNEL_DISCONNECTED`. Defaults to both.",
      options: CHANNEL_EVENTS,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getEvents() {
      return this.eventTypes?.length
        ? this.eventTypes
        : CHANNEL_EVENTS.map(({ value }) => value);
    },
    getWebhookChannels() {
      return [];
    },
    isRelevant(data) {
      return !this.channelIds?.length || this.channelIds.includes(data.channel?.id);
    },
    getSummary(data) {
      const name = data.channel?.name || data.channel?.id || "Channel";
      return data.event === "CHANNEL_CONNECTED"
        ? `Channel ${name} connected`
        : `Channel ${name} disconnected (${data.channel?.status ?? "disconnected"})`;
    },
  },
  sampleEmit,
};
