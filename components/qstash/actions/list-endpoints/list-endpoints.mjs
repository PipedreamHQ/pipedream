import qstash from "../../qstash.app.mjs";

export default {
  name: "List Endpoints",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "qstash-list-endpoints",
  description: "Lists all your existing QStash endpoints.",
  props: {
    qstash,
  },
  type: "action",
  async run({ $ }) {
    return this.qstash.listEndpoints({
      $,
    });
  },
};
