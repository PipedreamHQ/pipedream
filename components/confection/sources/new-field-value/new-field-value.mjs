import common from "../common.mjs";
import confection from "../../confection.app.mjs";

export default {
  key: "confection-new-field-value",
  name: "New Field Value",
  version: "0.1.1",
  dedupe: "unique",
  type: "source",
  description:
    "Emit new event when the UUID is significant enough to be classified as a lead. You define the field of significance and if a UUID gets a value for this field, it will trigger.",
  props: {
    ...common.props,
    triggerField: {
      propDefinition: [
        confection,
        "triggerField",
      ],
      description:
        "Define a field to be used to indicate that a UUID is significant enough to be a lead. You must enter the form input name which Confection uses as the api name of the field.",
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
     * Get data from Confection Live API
     *
     * @param {string} lastTimestamp - Start of results time frame
     * @param {string} timestamp - End of results time frame
     */
    getSourceData(lastTimestamp, timestamp) {
      return this.confection.getNewFieldValue(
        this.triggerField,
        lastTimestamp,
        timestamp,
      );
    },
  },
  run: common.run,
};
