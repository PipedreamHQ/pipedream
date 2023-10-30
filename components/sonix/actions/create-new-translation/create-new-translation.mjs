import sonix from "../../sonix.app.mjs";

export default {
  key: "sonix-create-new-translation",
  name: "Create New Translation",
  description: "Creates a new translation for a selected media file. [See the documentation](https://sonix.ai/docs/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sonix,
    mediaId: {
      propDefinition: [
        sonix,
        "mediaId",
        (c) => ({
          status: "completed",
        }),
      ],
    },
  },
  async run({ $ }) {
    if (!this.mediaId) {
      throw new Error("No media file selected. Please select a media file with 'completed' status.");
    }
    const response = await this.sonix.createTranslation(this.mediaId);
    $.export("$summary", `Successfully created translation for media ID: ${this.mediaId}`);
    return response;
  },
};
