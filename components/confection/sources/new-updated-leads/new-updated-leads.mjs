import common from "../common.mjs";

export default {
  key: "confection-new-updated-leads",
  name: "New or Updated UUID",
  version: "0.0.1",
  dedupe: "unique",
  description:
    "Triggers when any UUID is created or updated. To learn more about how Confection handles UUIDs, visit https://confection.io/main/demo/#uuid.",
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
     * Get URL for Confection leads Live API endpoint
     *
     * @param {string} lastTimestamp - Start of results time frame
     * @param {string} timestamp - End of results time frame
     */
    getUrl(lastTimestamp, timestamp) {
      return `https://transmission.confection.io/${this.confection.$auth.account_id}/leads/between/${lastTimestamp}/${timestamp}/`;
    },
  },
  run: common.run,
};
