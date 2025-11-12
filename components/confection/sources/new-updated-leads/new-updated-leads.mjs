import common from "../common.mjs";

export default {
  key: "confection-new-updated-leads",
  name: "New or Updated Leads",
  version: "0.1.1",
  dedupe: "unique",
  type: "source",
  description:
    "Emit new event when any UUID is created or updated. To learn more about how Confection handles UUIDs, visit https://confection.io/main/demo/#uuid.",
  props: common.props,

  methods: {
    ...common.methods,
    /**
     * Get summary for the triggered event
     *
     * @param {string} uuid - Emitted data UUID
     */
    getSummary(uuid) {
      return `New or updated UUID: ${uuid}`;
    },
    /**
     * Get data from Confection Live API
     *
     * @param {string} lastTimestamp - Start of results time frame
     * @param {string} timestamp - End of results time frame
     */
    getSourceData(lastTimestamp, timestamp) {
      return this.confection.getNewOrUpdatedLeads(lastTimestamp, timestamp);
    },
  },
  run: common.run,
};
