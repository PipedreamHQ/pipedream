import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "refiner-new-segment-entry",
  name: "New Segment Entry",
  description: "Emit new event whenever a user enters a segment in Refiner. [See the documentation](https://refiner.io/docs/api/#get-contacts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    segmentId: {
      propDefinition: [
        common.props.refiner,
        "segmentId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getFunction() {
      return this.refiner.listContacts;
    },
    getParams() {
      return {
        segment_uuid: this.segmentId,
      };
    },
    getSummary(item) {
      return `User ${item.email} entered segment ${this.segmentId}`;
    },
    getItemDate(item) {
      return item.segments
        .filter(({ uuid }) => uuid === this.segmentId)[0].created_at;
    },
  },
  sampleEmit,
};
