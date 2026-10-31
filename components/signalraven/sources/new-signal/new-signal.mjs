import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "signalraven-new-signal",
  name: "New Signal",
  description: "Emit new event when SignalRaven qualifies a new buying-intent signal: the person's company, LinkedIn profile and location, a strength score out of 10, why it matters, and talking points. [See the documentation](https://signalraven.ai/developers/api)",
  type: "source",
  ai: "optimized",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    minStrength: {
      propDefinition: [
        common.props.app,
        "minStrength",
      ],
    },
    signalType: {
      propDefinition: [
        common.props.app,
        "signalType",
      ],
    },
  },
  methods: {
    ...common.methods,
    async fetchPage(offset) {
      const { data } = await this.app.listSignals({
        params: {
          minStrength: this.minStrength,
          type: this.signalType,
          limit: constants.MAX_LIMIT,
          offset,
        },
      });
      return data || [];
    },
    generateMeta(signal) {
      const who = signal.person?.company || signal.person?.linkedinUrl || signal.id;
      return {
        id: signal.id,
        summary: `New signal: ${who} (strength ${signal.strength})`,
        ts: this.getTs(signal),
      };
    },
  },
};
