import qstash from "../../qstash.app.mjs";

export default {
  name: "Create Topic",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "qstash-create-topic",
  description: "Create a new QStash topic that emits to multiple endpoints.",
  props: {
    qstash,
    topicName: {
      propDefinition: [
        qstash,
        "topicName",
      ],
    },
  },
  type: "action",
  async run({ $ }) {
    return this.qstash.createTopic({
      $,
      topicName: this.topicName,
    });
  },
};
