import common from "../common/base.mjs";

export default {
  ...common,
  key: "zoho_notebook-new-audio-card",
  name: "New Audio Card",
  description: "Emit new event when a new audio card is created in Zoho Notebook",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(item) {
      return item.type === "note/audio";
    },
    getSummary(item) {
      return `New Audio Card ID: ${item.notecard_id}`;
    },
  },
};
