import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "yespo-new-contact-in-segment",
  name: "New Contact in Segment",
  description: "Emit new event when a contact is added to a specific segment in Yespo.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    segmentId: {
      propDefinition: [
        common.props.yespo,
        "segmentId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getFn() {
      return this.yespo.listContactsFromSegment;
    },
    getData() {
      return {
        segmentId: this.segmentId,
      };
    },
  },
  sampleEmit,
};
