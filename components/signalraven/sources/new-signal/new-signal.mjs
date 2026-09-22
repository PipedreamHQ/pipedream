import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "signalraven-new-signal",
  name: "New Signal",
  description: "Emit new event when SignalRaven qualifies a new buying-intent signal. [See the documentation](https://signalraven.ai/developers/api)",
  type: "source",
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
    async fetchItems() {
      const { data } = await this.app.listSignals({
        params: {
          minStrength: this.minStrength,
          type: this.signalType,
          limit: constants.MAX_LIMIT,
        },
      });
      return data || [];
    },
    generateMeta(signal) {
      const who = [
        signal.person?.name,
        signal.person?.company,
      ].filter(Boolean).join(" at ");
      return {
        id: signal.id,
        summary: `New signal: ${who || signal.id} (strength ${signal.strength})`,
        ts: this.getTs(signal),
      };
    },
  },
};
