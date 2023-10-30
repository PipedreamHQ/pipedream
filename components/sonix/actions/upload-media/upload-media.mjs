import sonix from "../../sonix.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sonix-upload-media",
  name: "Upload Media",
  description: "Submits new media for processing. [See the documentation](https://sonix.ai/docs/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sonix,
    fileUrl: {
      propDefinition: [
        sonix,
        "fileUrl",
      ],
    },
    language: {
      propDefinition: [
        sonix,
        "language",
      ],
    },
    folderId: {
      propDefinition: [
        sonix,
        "folderId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the file in Sonix. If no name is provided, we will default to the filename.",
      optional: true,
    },
    transcriptText: {
      type: "string",
      label: "Transcript Text",
      description: "Existing transcript - if present, will align the transcript rather than transcribing.",
      optional: true,
    },
    keywords: {
      type: "string",
      label: "Keywords",
      description: "Comma separated list of words or phrases to use as hints to the transcription engine. If this is provided, then the account level keywords will not be used.",
      optional: true,
    },
    customData: {
      type: "object",
      label: "Custom Data",
      description: "Set of key-value pairs that you can attach to the media. This can be useful for storing additional information about file.",
      optional: true,
    },
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "URL for Sonix to make a POST request notifying of a change in transcript status (either failed or completed). The POST will include the media status JSON.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sonix.submitNewMedia({
      data: {
        file_url: this.fileUrl,
        language: this.language,
        folder_id: this.folderId,
        name: this.name,
        transcript_text: this.transcriptText,
        keywords: this.keywords,
        custom_data: this.customData,
        callback_url: this.callbackUrl,
      },
    });
    $.export("$summary", `Successfully uploaded media with ID: ${response.id}`);
    return response;
  },
};
