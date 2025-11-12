import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bitport-new-media",
  name: "New Media",
  description: "Emit new event when a new media is added to a project in Bitport. [See the documentation](https://bitport.io/api/index.html?url=/v2/cloud/byPath)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFilter(items) {
      return items.filter((item) => {
        return [
          "video",
          "audio",
        ].includes(item.type);
      });
    },
    getSummary(item) {
      return `New Media: ${item.name}`;
    },
  },
  sampleEmit,
};
