import lmnt from "../../lmnt.app.mjs";

export default {
  key: "lmnt-generate-speech-from-text",
  name: "Generate Speech from Text",
  description: "Generates speech from text using LMNT's API. [See the documentation](https://docs.lmnt.com/api-reference/speech/synthesize-speech-1)",
  version: "0.0.1",
  type: "action",
  props: {
    lmnt,
    voice: {
      propDefinition: [
        lmnt,
        "voice",
      ],
    },
    text: {
      propDefinition: [
        lmnt,
        "text",
      ],
    },
    format: {
      propDefinition: [
        lmnt,
        "format",
      ],
    },
    length: {
      propDefinition: [
        lmnt,
        "length",
      ],
    },
    returnDurations: {
      propDefinition: [
        lmnt,
        "returnDurations",
      ],
    },
    seed: {
      propDefinition: [
        lmnt,
        "seed",
      ],
    },
    speed: {
      propDefinition: [
        lmnt,
        "speed",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lmnt.synthesizeSpeech({
      $,
      data: {
        format: this.format,
        length: this.length,
        return_durations: this.returnDurations,
        seed: this.seed,
        speed: this.speed && Number(this.speed),
        text: this.text,
        voice: this.voice,
      },
    });

    $.export("$summary", `Generated speech from text: "${this.text}"`);
    return response;
  },
};
