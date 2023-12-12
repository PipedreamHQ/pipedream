import common from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "reply_io-new-prospect-finished",
  name: "New Prospect Finished (Instant)",
  description: "Emit new event when a prospect finishes the sequence. [See the docs here](https://apidocs.reply.io/#84947c50-24b8-411c-bb71-d6cddf49fc16)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    finishReasons: {
      type: "string[]",
      label: "Finish Reasons",
      description: "The reason the sequence finished. Leave blank to include all reasons",
      options: constants.FINISH_REASONS,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    isRelevant(body) {
      const reasons = this.finishReasons;
      if (!reasons || reasons.length === 0) {
        return true;
      }
      return reasons.includes(body.finish_reason.toString());
    },
    getEventType() {
      return "contact_finished";
    },
  },
};
