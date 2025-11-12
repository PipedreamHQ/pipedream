import common from "../common.mjs";
import confection from "../../confection.app.mjs";

export default {
  key: "confection-new-event",
  name: "New Event",
  version: "0.1.1",
  dedupe: "unique",
  type: "source",
  description:
    "Emit new event when a UUID receives a value for the configured **Event Name**. The latest value as well a history of all values ever received for that **Event Name** will be returned.",
  props: {
    ...common.props,
    eventName: {
      propDefinition: [
        confection,
        "eventName",
      ],
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
     * Get data from Confection Live API
     *
     * @param {string} lastTimestamp - Start of results time frame
     * @param {string} timestamp - End of results time frame
     */
    getSourceData(lastTimestamp, timestamp) {
      return this.confection.getNewEvent(
        this.eventName,
        lastTimestamp,
        timestamp,
      );
    },
  },
  run: common.run,
};
