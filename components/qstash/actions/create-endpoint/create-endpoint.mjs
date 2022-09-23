import qstash from "../../qstash.app.mjs";

export default {
  name: "Create Endpoint",
  version: "0.0.1",
  key: "qstash-create-endpoint",
  description: "",
  props: {
    qstash,
    topicName: {
      propDefinition: [
        qstash,
        "topicName",
      ],
    },
    topicId: {
      propDefinition: [
        qstash,
        "topicId",
      ],
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
