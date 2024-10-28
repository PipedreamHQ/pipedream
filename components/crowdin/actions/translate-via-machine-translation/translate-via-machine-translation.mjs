import crowdin from "../../crowdin.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "crowdin-translate-via-machine-translation",
  name: "Translate via Machine Translation",
  description: "Performs machine translation of the uploaded files. [See the documentation](https://support.crowdin.com/developer/api/v2/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    crowdin,
    mtId: {
      propDefinition: [
        crowdin,
        "mtId",
      ],
    },
    targetLanguageId: {
      type: "string",
      label: "Target Language ID",
      description: "The language ID for the target translation language",
      async options() {
        const languages = await this.crowdin.listSupportedLanguages();
        return languages.map((language) => ({
          label: language.name,
          value: language.id,
        }));
      },
    },
    strings: {
      propDefinition: [
        crowdin,
        "strings",
      ],
    },
    languageRecognitionProvider: {
      type: "string",
      label: "Language Recognition Provider",
      description: "Optional language recognition provider",
      optional: true,
    },
    sourceLanguageId: {
      type: "string",
      label: "Source Language ID",
      description: "The language ID of the source language",
      async options() {
        const languages = await this.crowdin.listSupportedLanguages();
        return languages.map((language) => ({
          label: language.name,
          value: language.id,
        }));
      },
    },
  },
  async run({ $ }) {
    const response = await this.crowdin.performMachineTranslation({
      mtId: this.mtId,
      targetLanguageId: this.targetLanguageId,
      strings: this.strings,
      languageRecognitionProvider: this.languageRecognitionProvider,
      sourceLanguageId: this.sourceLanguageId,
    });

    $.export("$summary", "Successfully performed machine translation");
    return response;
  },
};
