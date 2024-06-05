import speechace from "../../speechace.app.mjs";

export default {
  key: "speechace-score-scripted-recording",
  name: "Score Scripted Recording",
  description: "Scores a scripted recording based on fluency and pronunciation. [See the documentation](https://docs.speechace.com/)",
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
    const response = await this.speechace.scoreScript(this.audioFile, this.textScript);
    $.export("$summary", `Scored scripted recording with id ${response.audio_id}`);
    return response;
  },
};
