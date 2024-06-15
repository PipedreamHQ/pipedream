import speechace from "../../speechace.app.mjs";
import FormData from "form-data";
import fs from "fs";

export default {
  key: "speechace-transcribe-and-score-recording",
  name: "Transcribe and Score Recording",
  description: "Transcribes and scores a provided speech recording. [See the documentation](https://docs.speechace.com/#76089b5d-7e25-4744-8d32-f6c230acf217)",
  version: "0.0.1",
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
  },
  async run({ $ }) {
    const data = new FormData();
    const content = fs.createReadStream(this.filePath.includes("tmp/")
      ? this.filePath
      : `/tmp/${this.filePath}`);
    data.append("user_audio_file", content);
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
    $.export("$summary", `Transcription and scoring completed for audio file: ${this.filePath}`);
    return response;
  },
};
