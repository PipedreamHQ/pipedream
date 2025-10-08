import qstash from "../../qstash.app.mjs";

export default {
  name: "Create Endpoint",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "qstash-create-endpoint",
  description: "Create a new HTTP endpoint on a QStash topic.",
  props: {
    qstash,
    topicId: {
      type: "string",
      label: "QStash Topic",
      description: "The QStash topic to subscribe to.",
      async options() {
        const topics = await this.qstash.listTopics({
          $: this,
        });

        return topics.map((topic) => ({
          label: topic.name,
          value: topic.topicId,
        }));
      },
    },
    endpointUrl: {
      propDefinition: [
        qstash,
        "endpointUrl",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const {
      topicId, topicName, endpointUrl,
    } = this;
    return this.qstash.createEndpoint({
      $,
      topicId,
      topicName,
      endpointUrl,
    });
  },
};
