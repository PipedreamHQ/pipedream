import app from "../../ollama.app.mjs";

export default {
  key: "ollama-push-model",
  name: "Push Model to Library",
  description: "Upload a model to a model library. Requires registering for ollama.ai and adding a public key first. [See the documentation](https://github.com/ollama/ollama/blob/main/docs/api.md#push-a-model).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      description: "Name of the model to push in the form of `<namespace>/<model>:<tag>`. Please make sure you follow [the instructions in this issue](https://github.com/ollama/ollama/issues/1140#issuecomment-1814823949) in order to push a model to your own library in [ollama.com](https://ollama.com/).",
      propDefinition: [
        app,
        "model",
      ],
    },
    insecure: {
      propDefinition: [
        app,
        "insecure",
      ],
    },
    stream: {
      propDefinition: [
        app,
        "stream",
      ],
    },
  },
  methods: {
    pushModel(args = {}) {
      return this.app.post({
        path: "/push",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      pushModel,
      name,
      insecure,
      stream,
    } = this;

    const response = await pushModel({
      $,
      data: {
        name,
        insecure,
        stream,
      },
    });

    $.export("$summary", "Successfully pushed model.");
    return response;
  },
};
