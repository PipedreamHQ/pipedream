import common from "../common-polling.mjs";

export default {
  ...common,
  name: "Card Expired",
  key: "pipefy-card-expired",
  description: "Emits an event each time a card becomes expired in a Pipe.",
  version: "0.0.3",
  type: "source",
  methods: {
    isCardRelevant({ node }) {
      return (
        node.expired &&
        !node.done
      );
    },
    getMeta({
      node, event,
    }) {
      const {
        id: nodeId,
        title: summary,
        current_phase: { id: currentPhaseId },
      } = node;
      const id = `${nodeId}${currentPhaseId}`;
      const { timestamp: ts } = event;
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
