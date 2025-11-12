import azureOpenAI from "../../azure_openai_service.app.mjs";
import common from "../common/common-helper.mjs";
import lang from "../common/lang.mjs";

const langOptions = lang.LANGUAGES.map((l) => ({
  label: l.label,
  value: l.value,
}));

export default {
  ...common,
  key: "azure_openai_service-translate-text",
  name: "Translate Text",
  description: "Translate text from one language to another. [See the documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#chat-completions)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    azureOpenAI,
    text: {
      label: "Text",
      description: "Text to translate",
      type: "string",
    },
    sourceLang: {
      label: "Source language",
      description: "The language of your provided text",
      type: "string",
      options: langOptions,
    },
    targetLang: {
      label: "Target language",
      description: "The language you want to translate your text to",
      type: "string",
      options: langOptions,
    },
    ...common.props,
  },
  methods: {
    ...common.methods,
    systemInstructions() {
      return "Your goal is to translate the text the user provides. Please follow the language guidelines presented in the prompt.";
    },
    userMessage() {
      return `Translate the following text from ISO 639-1 ${this.sourceLang} to ISO 639-1 ${this.targetLang}:\n\n${this.text}`;
    },
    summary() {
      return `Translated text from ${this.sourceLang} to ${this.targetLang}.`;
    },
    formatOutput({
      messages, response,
    }) {
      if (!messages || !response) {
        throw new Error("Invalid API output, please reach out to https://pipedream.com/support");
      }

      return {
        translation: response.choices?.[0]?.message?.content,
        source_lang: this.sourceLang,
        target_lang: this.targetLang,
        messages,
      };
    },
  },
};
