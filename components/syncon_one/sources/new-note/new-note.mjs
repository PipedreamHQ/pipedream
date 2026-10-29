import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-new-note",
  name: "New Note",
  description:
    "Emit new event when a note is written on a customer, company, lead or deal, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "note.created";
    },
    getPath() {
      return "/notes";
    },
    getIdKey() {
      return "noteId";
    },
    getSummary() {
      return "New Note";
    },
  },
};
