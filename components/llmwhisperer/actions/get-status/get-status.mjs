import app from "../../llmwhisperer.app.mjs";

export default {
  key: "llmwhisperer-get-status",
  name: "Get Status",
  description: "Get the status of the whisper process. This can be used to check the status of the conversion process when the conversion is done in async mode. [See the documentation](https://docs.unstract.com/llm_whisperer/apis/llm_whisperer_text_extraction_status_api)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    whisperHash: {
      propDefinition: [
        app,
        "whisperHash",
      ],
    },
  },
  methods: {
    getStatus(args = {}) {
      return this.app._makeRequest({
        path: "/whisper-status",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getStatus,
      whisperHash,
    } = this;

    const response = await getStatus({
      $,
      params: {
        "whisper-hash": whisperHash,
      },
    });

    $.export("$summary", "Successfully retrieved status.");
    return response;
  },
};
