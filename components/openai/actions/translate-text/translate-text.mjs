import common from "../common/common-helper.mjs";
import lang from "../common/lang.mjs";

const langOptions = lang.LANGUAGES.map((l) => ({
  label: l.label,
  value: l.value,
}));

export default {
  ...common,
  name: "Translate Text (Whisper)",
  version: "0.0.14",
  key: "openai-translate-text",
  description: "Translate text from one language to another using the Chat API. [See the documentation](https://platform.openai.com/docs/api-reference/chat)",
  type: "action",
  props: {
    ...common.props,
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
      return `Translated text from ${this.sourceLang} to ${this.targetLang}`;
    },
    formatOutput({
      messages, response,
    }) {
      if (!messages || !response) {
        throw new Error("Invalid API output, please reach out to https://pipedream.com/support");
      }
      const output = {
        source_lang: this.sourceLang,
        target_lang: this.targetLang,
        messages,
      };
      if (this.n > 1) {
        output.translations = response.choices?.map(({ message }) => message.content);
      } else {
        output.translation = response.choices?.[0]?.message?.content;
      }
      return output;
    },
  },
};
