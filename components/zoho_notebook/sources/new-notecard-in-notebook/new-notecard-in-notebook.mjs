import common from "../common/base.mjs";

export default {
  ...common,
  key: "zoho_notebook-new-notecard-in-notebook",
  name: "New Note Card in Notebook",
  description: "Emit new event when a new notecard is created in a specific notebook in Zoho Notebook.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(item) {
      return `New Notecard ID: ${item.notecard_id}`;
    },
  },
};
