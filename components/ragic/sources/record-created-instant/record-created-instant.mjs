import ragic from "../../ragic.app.mjs";

export default {
  key: "ragic-record-created-instant",
  name: "New Created Record (Instant)",
  description: "Emit new event when a record is created",
  version: "0.0.1",
  type: "source",
  props: {
    ragic,
  },
  async run() {},
};
