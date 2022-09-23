import qstash from "../../qstash.app.mjs";

export default {
  name: "Create Topic",
  version: "0.0.1",
  key: "qstash-create-topic",
  description: "",
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
  methods: {},
  async run({ $ }) {
    return this.qstash.createTopic({
      $,
      topicName: this.topicName,
    });
  },
};
