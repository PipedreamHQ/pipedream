import common from "../common-polling.mjs";

export default {
  ...common,
  name: "Card Late",
  key: "pipefy-card-late",
  description: "Emits an event each time a card becomes late in a Pipe.",
  version: "0.0.3",
  type: "source",
  methods: {
    isCardRelevant({ node }) {
      return (
        node.late &&
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
