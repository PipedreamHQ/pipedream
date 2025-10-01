import app from "../../llmwhisperer.app.mjs";

export default {
  key: "llmwhisperer-retrieve-text",
  name: "Retrieve Extracted Text",
  description: "Retrieve the extracted text executed through the whisper API. This can be used to retrieve the text of the conversion process when the conversion is done in async mode. [See the documentation](https://docs.unstract.com/llm_whisperer/apis/llm_whisperer_text_extraction_retrieve_api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    retrieveText(args = {}) {
      return this.app._makeRequest({
        path: "/whisper-retrieve",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      retrieveText,
      whisperHash,
    } = this;

    const response = await retrieveText({
      $,
      params: {
        "whisper-hash": whisperHash,
      },
    });

    $.export("$summary", "Successfully retrieved extracted text.");
    return response;
  },
};
