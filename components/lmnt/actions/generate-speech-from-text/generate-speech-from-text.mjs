import lmnt from "../../lmnt.app.mjs";

export default {
  key: "lmnt-generate-speech-from-text",
  name: "Generate Speech from Text",
  description: "Generates speech from text using LMNT's API. [See the documentation](https://docs.lmnt.com/api-reference/speech/synthesize-speech-1)",
  version: "0.0.1",
  type: "action",
  props: {
    lmnt,
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
    text: {
      propDefinition: [
        lmnt,
        "text",
      ],
    },
    voice: {
      propDefinition: [
        lmnt,
        "voice",
        (c) => ({
          format: c.format,
        }), // Pass format as input to the options method if needed
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lmnt.synthesizeSpeech({
      data: {
        format: this.format,
        length: this.length,
        return_durations: this.returnDurations,
        seed: this.seed,
        speed: this.speed,
        text: this.text,
        voice: this.voice,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    $.export("$summary", `Generated speech from text: "${this.text}"`);
    return response;
  },
};
