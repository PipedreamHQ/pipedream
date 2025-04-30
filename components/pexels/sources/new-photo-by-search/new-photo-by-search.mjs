import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pexels-new-photo-by-search",
  name: "New Photo by Search",
  description: "Emit new event when a photo is published that matches a specified search query. [See the documentation](https://www.pexels.com/api/documentation/#photos-search)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    searchQuery: {
      propDefinition: [
        common.props.pexels,
        "searchQuery",
      ],
    },
    orientation: {
      propDefinition: [
        common.props.pexels,
        "orientation",
      ],
    },
    size: {
      propDefinition: [
        common.props.pexels,
        "size",
      ],
    },
    color: {
      propDefinition: [
        common.props.pexels,
        "color",
      ],
    },
  },
  methods: {
    ...common.methods,
    getFunction() {
      return this.pexels.searchPhotos;
    },
    getParams() {
      return {
        query: this.searchQuery,
        orientation: this.orientation,
        size: this.size,
        color: this.color,
      };
    },
    getSummary(item) {
      return `New photo with ID: ${item.id}`;
    },
  },
  sampleEmit,
};
