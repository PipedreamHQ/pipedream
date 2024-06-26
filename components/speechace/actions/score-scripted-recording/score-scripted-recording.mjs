import speechace from "../../speechace.app.mjs";
import FormData from "form-data";
import fs from "fs";

export default {
  key: "speechace-score-scripted-recording",
  name: "Score Scripted Recording",
  description: "Scores a scripted recording based on fluency and pronunciation. [See the documentation](https://docs.speechace.com/#c34b11dd-8172-441a-bc27-223339d48d8e)",
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
    text: {
      type: "string",
      label: "Text",
      description: "A word, phrase, or sentence to score",
    },
    questionInfo: {
      type: "string",
      label: "Question Info",
      description: "A unique identifier for the activity or question this user audio is answering",
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
    if (this.text) {
      data.append("text", this.text);
    }
    if (this.questionInfo) {
      data.append("question_info", this.questionInfo);
    }

    const response = await this.speechace.scoreScript({
      $,
      params: {
        dialect: this.dialect,
        user_id: this.userId,
      },
      data,
      headers: data.getHeaders(),
    });
    $.export("$summary", `Scored scripted recording for audio file: ${this.filePath}`);
    return response;
  },
};
