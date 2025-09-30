import qstash from "../../qstash.app.mjs";

export default {
  name: "List Topics",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "qstash-list-topics",
  description: "List all your existing QStash topics.",
  props: {
    qstash,
  },
  type: "action",
  async run({ $ }) {
    return await this.qstash.listTopics({
      $,
    });
  },
};
