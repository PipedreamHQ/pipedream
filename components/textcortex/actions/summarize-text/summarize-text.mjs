import app from "../../textcortex.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "textcortex-summarize-text",
  name: "Summarize Text",
  description: "Summarize given text. The text can be provided as a string or as a file ID. [See the documentation](https://docs.textcortex.com/api/paths/texts-summarizations/post)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    fileId: {
      type: "string",
      label: "File ID",
      description: "The ID of the file to summarize. **string<uuid>** Example: `8a0cfb4f-ddc9-436d-91bb-75133c583767`",
      optional: true,
    },
    maxTokens: {
      propDefinition: [
        app,
        "maxTokens",
      ],
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "The summarization mode.",
      options: Object.values(constants.SUMMARIZE_MODE),
      optional: true,
    },
    model: {
      optional: true,
      propDefinition: [
        app,
        "model",
      ],
    },
    n: {
      propDefinition: [
        app,
        "n",
      ],
    },
    sourceLang: {
      propDefinition: [
        app,
        "sourceLang",
      ],
    },
    targetLang: {
      propDefinition: [
        app,
        "targetLang",
      ],
    },
    temperature: {
      propDefinition: [
        app,
        "temperature",
      ],
    },
    text: {
      description: "The text to summarize.",
      optional: true,
      propDefinition: [
        app,
        "text",
      ],
    },
  },
  methods: {
    summarizeText(args = {}) {
      return this.app.post({
        path: "/texts/summarizations",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      summarizeText,
      fileId,
      maxTokens,
      model,
      mode,
      n,
      sourceLang,
      targetLang,
      temperature,
      text,
    } = this;

    const response = await summarizeText({
      step,
      data: {
        file_id: fileId,
        max_tokens: maxTokens,
        model,
        mode,
        n,
        source_lang: sourceLang,
        target_lang: targetLang,
        temperature,
        text,
      },
    });

    step.export("$summary", `Successfully summarized with status \`${response.status}\``);

    return response;
  },
};
