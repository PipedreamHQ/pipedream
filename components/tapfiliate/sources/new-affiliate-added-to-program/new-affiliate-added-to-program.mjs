import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "tapfiliate-new-affiliate-added-to-program",
  name: "New Affiliate Added to Program",
  description: "Emit new event when an affiliate is added to a program. [See the documentation](https://tapfiliate.com/docs/rest/#programs-program-affiliates-collection-get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    programId: {
      propDefinition: [
        common.props.tapfiliate,
        "programId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getArgs() {
      return {
        programId: this.programId,
      };
    },
    getFunction() {
      return this.tapfiliate.listProgramAffiliates;
    },
    getSummary(item) {
      return `New affiliate added to program: ${item.firstname} ${item.lastname}`;
    },
  },
  sampleEmit,
};
