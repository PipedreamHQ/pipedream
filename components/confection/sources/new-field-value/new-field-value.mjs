import common from "../common.mjs";

export default {
  key: "confection-new-field-value",
  name: "New Lead",
  version: "0.0.1",
  dedupe: "unique",
  description:
    "Triggers when a UUID is significant enough to be classified as a lead. You define the field of significance and if a UUID gets a value for this field, it will trigger.",
  props: {
    ...common.props,
    triggerField: {
      type: "string",
      label: "Field of Significance",
      description:
        "Define a field to be used to indicate that a UUID is significant enough to be a lead. You must enter the form input name which Confection uses as the api name of the field.",
      default: "email",
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
      return `New ${this.triggerField} lead with UUID: ${uuid}`;
    },
    /**
     * Get URL for Confection /leads/field/{field_name} Live API endpoint
     *
     * @param {string} lastTimestamp - Start of results time frame
     * @param {string} timestamp - End of results time frame
     */
    getUrl(lastTimestamp, timestamp) {
      return `https://transmission.confection.io/${this.confection.$auth.account_id}/leads/field/${this.triggerField}/between/${lastTimestamp}/${timestamp}/`;
    },
  },
  run: common.run,
};
