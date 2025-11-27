import base from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "gorgias_oauth-new-macro-created",
  name: "New Macro Created",
  description: "Emit new event when a macro is created. [See the documentation](https://developers.gorgias.com/reference/the-event-object)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getEventType() {
      return "macro-created";
    },
    getTsKey() {
      return "created_datetime";
    },
    async getEventData(event) {
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
