import { LANGUAGE_R_PROVIDER_OPTIONS } from "../../common/constants.mjs";
import crowdin from "../../crowdin.app.mjs";

export default {
  key: "crowdin-translate-via-machine-translation",
  name: "Translate via Machine Translation",
  description: "Performs machine translation of the uploaded files. [See the documentation](https://support.crowdin.com/developer/api/v2/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      propDefinition: [
        crowdin,
        "sourceLanguageId",
      ],
      type: "string",
      label: "Target Language ID",
      description: "The language ID for the target translation language",
    },
    languageRecognitionProvider: {
      type: "string",
      label: "Language Recognition Provider",
      description: "Select a provider for language recognition **Note:** Is required if the source language is not selected",
      options: LANGUAGE_R_PROVIDER_OPTIONS,
    },
    sourceLanguageId: {
      propDefinition: [
        crowdin,
        "sourceLanguageId",
      ],
    },
    strings: {
      type: "string[]",
      label: "Strings",
      description: "Array of strings to be translated. **Note:** You can translate up to 100 strings at a time.",
    },
  },
  async run({ $ }) {
    const response = await this.crowdin.performMachineTranslation({
      $,
      mtId: this.mtId,
      data: {
        targetLanguageId: this.targetLanguageId,
        strings: this.strings,
        languageRecognitionProvider: this.languageRecognitionProvider,
        sourceLanguageId: this.sourceLanguageId,
      },
    });

    $.export("$summary", "Successfully performed machine translation");
    return response;
  },
};
