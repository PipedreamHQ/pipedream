import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "flippingbook-new-lead-instant",
  name: "New Lead (Instant)",
  description: "Emit new event when a new lead is created via a lead capture form.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    flipbookId: {
      propDefinition: [
        common.props.flippingbook,
        "flipbookId",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getHookParams() {
      const params = {
        triggerOn: [
          "publication",
        ],
        events: [
          "lead",
        ],
      };
      if (this.flipbookId) {
        params.limitTo = {
          parentObject: "publication",
          parentObjectId: this.flipbookId,
        };
      }
      return params;
    },
    generateMeta(body) {
      return {
        id: body.additionalInfo.uniqueKey,
        summary: "New Lead Created",
        ts: Date.now(),
      };
    },
  },
  async run(event) {
    const { body } = event;
    this.$emit(body, this.generateMeta(body));
  },
  sampleEmit,
};
