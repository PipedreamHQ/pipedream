import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "remote-new-custom-field-value-updated-instant",
  name: "New Custom Field Value Updated (Instant)",
  description: "Emit new event when a custom field is updated. [See the documentation](https://developer.remote.com/reference/customfieldupdated)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "custom_field.value_updated",
      ];
    },
    generateMeta({
      body,
      ts,
    }) {
      return {
        id: body.custom_field_id,
        summary: `Custom field with ID ${body.custom_field_id} has been updated`,
        ts,
      };
    },
  },
  sampleEmit,
};
