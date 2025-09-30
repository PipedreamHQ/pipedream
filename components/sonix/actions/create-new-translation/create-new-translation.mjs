import { LANGUAGE_OPTIONS } from "../../common/constants.mjs";
import sonix from "../../sonix.app.mjs";

export default {
  key: "sonix-create-new-translation",
  name: "Create New Translation",
  description: "Creates a new translation for a selected media file. [See the documentation](https://sonix.ai/docs/api#create_translation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sonix,
    mediaId: {
      propDefinition: [
        sonix,
        "mediaId",
      ],
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language code for the translation",
      options: LANGUAGE_OPTIONS,
    },
  },
  async run({ $ }) {
    const response = await this.sonix.createTranslation({
      $,
      mediaId: this.mediaId,
      data: {
        language: this.language,
      },
    });

    $.export("$summary", `Successfully created translation for media ID: ${this.mediaId}`);
    return response;
  },
};
