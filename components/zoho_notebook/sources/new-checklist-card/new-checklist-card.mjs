import common from "../common/base.mjs";

export default {
  ...common,
  key: "zoho_notebook-new-checklist-card",
  name: "New Checklist Card",
  description: "Emit new event when a new checklist card is created in Zoho Notebook.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(item) {
      return item.type === "note/checklist";
    },
    getSummary(item) {
      return `New Checklist Card ID: ${item.notecard_id}`;
    },
  },
};
