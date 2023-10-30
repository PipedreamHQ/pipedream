import sonix from "../../sonix.app.mjs";

export default {
  key: "sonix-get-text-transcript",
  name: "Get Text Transcript",
  description: "Gets the text transcript of a selected media file. [See the documentation](https://sonix.ai/docs/api)",
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
    const response = await this.sonix.getTextTranscript(this.mediaId);
    $.export("$summary", `Successfully fetched transcript for media ID: ${this.mediaId}`);
    return response;
  },
};
