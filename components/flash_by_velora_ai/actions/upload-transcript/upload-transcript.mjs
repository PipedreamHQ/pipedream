import flashByVeloraAi from "../../flash_by_velora_ai.app.mjs";

export default {
  key: "flash_by_velora_ai-upload-transcript",
  name: "Upload Transcript",
  description: "Transfers a contact call transcript to the flash system for thorough analysis. [See the documentation](https://flash.velora.ai/developers/documentation/api)",
  version: "0.0.1",
  type: "action",
  props: {
    flashByVeloraAi,
    title: {
      type: "string",
      label: "Title",
      description: "Title of the meeting",
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "Transcript file (supported types: text/plain, pdf, vtt) or transcript text",
    },
    sourceType: {
      type: "string",
      label: "Source Type",
      description: "Type of the source system of the file. For example, Google Drive, Fireflies.ai etc.",
    },
  },
  async run({ $ }) {
    const response = await this.flashByVeloraAi.sendTranscript({
      $,
      data: {
        title: this.title,
        file_url: this.fileUrl,
        source_type: this.sourceType,
      },
    });
    $.export("$summary", "Transcript uploaded successfully");
    return response;
  },
};
