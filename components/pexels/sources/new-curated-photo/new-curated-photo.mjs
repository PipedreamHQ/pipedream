import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pexels-new-curated-photo",
  name: "New Curated Photo",
  description: "Emit new event when a new curated photo is added to the Pexels curated collection. [See the documentation](https://www.pexels.com/api/documentation/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.pexels.getCuratedPhotos;
    },
    getSummary(item) {
      return `New curated photo with ID: ${item.id}`;
    },
  },
  sampleEmit,
};
