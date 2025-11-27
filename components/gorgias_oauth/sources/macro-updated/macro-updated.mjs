import base from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "gorgias_oauth-macro-updated",
  name: "Macro Updated",
  description: "Emit new event when a macro is updated. [See the documentation](https://developers.gorgias.com/reference/the-event-object)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getEventType() {
      return "macro-updated";
    },
    getTsKey() {
      return "updated_datetime";
    },
    async getEventData(event) {
      if (event.created_datetime === event.updated_datetime) {
        return null;
      }
      try {
        return await this.gorgias_oauth.getMacro({
          id: event.object_id,
        });
      } catch (e) {
        console.log(`Macro ${event.object_id} not found`);
        return null;
      }
    },
  },
  sampleEmit,
};
