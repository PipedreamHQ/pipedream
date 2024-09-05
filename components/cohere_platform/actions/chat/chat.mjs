import app from "../../cohere_platform.app.mjs";
import { clearObj } from "../../common/utils.mjs";

export default {
  key: "cohere_platform-chat",
  name: "Chat",
  version: "0.0.1",
  description: "Generates a text response to a user message. [See the documentation](https://docs.cohere.com/reference/chat)",
  type: "action",
  props: {
    app,
    message: {
      propDefinition: [
        app,
        "message",
      ],
    },
    model: {
      propDefinition: [
        app,
        "model",
      ],
    },
    temperature: {
      propDefinition: [
        app,
        "temperature",
      ],
    },
    maxTokens: {
      propDefinition: [
        app,
        "maxTokens",
      ],
    },
    k: {
      propDefinition: [
        app,
        "k",
      ],
    },
    p: {
      propDefinition: [
        app,
        "p",
      ],
    },
    stopSequences: {
      propDefinition: [
        app,
        "stopSequences",
      ],
    },
    frequencyPenalty: {
      propDefinition: [
        app,
        "frequencyPenalty",
      ],
    },
  },
  methods: {
    chat(data) {
      return this.app.client().chat(data);
    },
  },
  async run({ $ }) {
    const {
      chat,
      message,
      model,
      temperature,
      maxTokens,
      k,
      p,
      stopSequences,
      frequencyPenalty,

    } = this;
    const response = await chat(clearObj({
      message,
      model,
      ...(temperature && {
        temperature: parseFloat(temperature),
      }),
      maxTokens,
      k,
      ...(p && {
        p: parseFloat(p),
      }),
      stopSequences,
      ...(frequencyPenalty && {
        frequencyPenalty: parseFloat(frequencyPenalty),
      }),
    }));

    $.export("$summary", `The message was successfully responded with ID \`${response.response_id}\``);
    return response;
  },
};
