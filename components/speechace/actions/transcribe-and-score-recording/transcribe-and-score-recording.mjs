import { axios } from "@pipedream/platform";
import speechace from "../../speechace.app.mjs";

export default {
  key: "speechace-transcribe-and-score-recording",
  name: "Transcribe and Score Recording",
  description: "Transcribes and scores a provided speech recording. [See the documentation](https://docs.speechace.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    speechace,
    audioFile: {
      propDefinition: [
        speechace,
        "audioFile",
      ],
    },
    textScript: {
      propDefinition: [
        speechace,
        "textScript",
      ],
    },
  },
  async run({ $ }) {
    const transcriptionResponse = await this.speechace.transcribeAndScore(this.audioFile);
    const scoringResponse = await this.speechace.scoreScript(this.audioFile, this.textScript);

    $.export("$summary", `Transcription and scoring completed for audio file: ${this.audioFile}`);
    return {
      transcription: transcriptionResponse,
      scoring: scoringResponse,
    };
  },
};
