import lmnt from "../../lmnt.app.mjs";
import FormData from "form-data";

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
    const data = new FormData();
    if (this.returnDurations) data.append("return_durations", this.returnDurations);
    if (this.speed) data.append("speed", Number(this.speed));
    [
      "format",
      "length",
      "seed",
      "text",
      "voice",
    ].forEach((key) => {
      if (this[key]) data.append(key, this[key]);
    });

    const response = await this.lmnt.synthesizeSpeech({
      $,
      headers: data.getHeaders(),
      data,
    });

    $.export("$summary", `Generated speech from text: "${this.text}"`);
    return response;
  },
};
