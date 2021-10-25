import common from "../common.mjs";

export default {
  key: "confection-new-event",
  name: "New Event",
  version: "0.0.1",
  dedupe: "unique",
  description:
    "Triggers when any UUID receives a value for a defined event name. The latest value as well a history of all values ever received for that event name will be returned.",
  props: {
    ...common.props,
    eventName: {
      type: "string",
      label: "Event Name",
      description:
        "Provide the event name to watch. All accounts have `loadtime` & `pageviewBatch` events by default.",
    },
  },
  methods: {
    ...common.methods,
    /**
     * Get summary for the triggered event
     *
     * @param {string} uuid - Emitted data UUID
     */
    getSummary(uuid) {
      return `New ${this.eventName} event with UUID: ${uuid}`;
    },
    /**
     * Get URL for Confection /leads/event/{event_name} Live API endpoint
     *
     * @param {string} lastTimestamp - Start of results time frame
     * @param {string} timestamp - End of results time frame
     */
    getUrl(lastTimestamp, timestamp) {
      return `https://transmission.confection.io/${this.confection.$auth.account_id}/leads/event/${this.eventName}/between/${lastTimestamp}/${timestamp}/`;
    },
  },
  run: common.run,
};
