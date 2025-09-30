import speechace from "../../speechace.app.mjs";
import FormData from "form-data";
import {
  getFileStreamAndMetadata, ConfigurationError,
} from "@pipedream/platform";

export default {
  key: "speechace-transcribe-and-score-recording",
  name: "Transcribe and Score Recording",
  description: "Transcribes and scores a provided speech recording. [See the documentation](https://docs.speechace.com/#76089b5d-7e25-4744-8d32-f6c230acf217)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    speechace,
    filePath: {
      propDefinition: [
        speechace,
        "filePath",
      ],
    },
    relevanceContext: {
      type: "string",
      label: "Relevance Context",
      description: "Question Prompt text provided to the user. When this parameter is passed, the relevance of the user audio transcript is evaluated given the relevance_context and a resulting relevance class is returned in .speech_score.relevance.class",
      optional: true,
    },
    dialect: {
      propDefinition: [
        speechace,
        "dialect",
      ],
    },
    userId: {
      propDefinition: [
        speechace,
        "userId",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const data = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePath);
    data.append("user_audio_file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });
    if (this.relevanceContext) {
      data.append("relevance_context", this.relevanceContext);
    }

    const response = await this.speechace.transcribeAndScore({
      $,
      params: {
        dialect: this.dialect,
        user_id: this.userId,
      },
      data,
      headers: data.getHeaders(),
    });
    if (response.status === "error") {
      throw new ConfigurationError(response.detail_message);
    }
    $.export("$summary", `Transcription and scoring completed for audio file: ${this.filePath}`);
    return response;
  },
};
