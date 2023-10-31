import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";
import { LANGUAGE_OPTIONS } from "../../common/constants.mjs";
import { checkTmp } from "../../common/utils.mjs";
import sonix from "../../sonix.app.mjs";

export default {
  key: "sonix-upload-media",
  name: "Upload Media",
  description: "Submits new media for processing. [See the documentation](https://sonix.ai/docs/api#new_media)",
  version: "0.0.1",
  type: "action",
  props: {
    sonix,
    file: {
      type: "string",
      label: "File",
      description: "Path of the audio or video file in /tmp folder. The limit is 100MB using this parameter. For larger files, use **File URL**. `NOTE: Only one of **File** or **File URL** is required.` To upload a file to /tmp folder, please follow the [doc here](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
      optional: true,
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "URL pointing to the audio/video file. `NOTE: Only one of **File** or **File URL** is required.`",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language code for the transcription.",
      options: LANGUAGE_OPTIONS,
    },
    folderId: {
      propDefinition: [
        sonix,
        "folderId",
      ],
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the file in Sonix. If no name is provided, we will default to the filename.",
      optional: true,
    },
    transcriptText: {
      type: "boolean",
      label: "Transcript Text",
      description: "Existing transcript - if present, will align the transcript rather than transcribing.",
      optional: true,
    },
    keywords: {
      type: "string[]",
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
    if (!this.file && !this.fileUrl) {
      throw new ConfigurationError("You must provite whether **File** or **File URL**.");
    }

    const formData = new FormData();

    if (this.file) {
      const filePath = checkTmp(this.file);
      formData.append("file", fs.createReadStream(filePath));
    }

    this.fileUrl && formData.append("file_url", this.fileUrl);
    this.language && formData.append("language", this.language);
    this.name && formData.append("name", this.name);
    this.transcriptText && formData.append("transcript_text", `${this.transcriptText}`);
    this.folderId && formData.append("folder_id", this.folderId);
    this.keywords && formData.append("keywords", this.keywords.toString());
    this.customData && formData.append("custom_data", JSON.stringify(this.customData));
    this.callbackUrl && formData.append("callback_url", this.callbackUrl);

    const response = await this.sonix.submitNewMedia({
      data: formData,
      headers: formData.getHeaders(),
    });
    $.export("$summary", `Successfully uploaded media with ID: ${response.id}`);
    return response;
  },
};
