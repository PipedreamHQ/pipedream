import aivoov from "../../aivoov.app.mjs";
import FormData from "form-data";

export default {
  key: "aivoov-convert-text-to-speech",
  name: "Convert Text to Speech",
  description:
    "Converts text to audio using the Aivoov API. [See the documentation](https://github.com/aivoov/aivoov-api)",
  version: "0.0.11",
  type: "action",
  props: {
    aivoov,
    provider: {
      propDefinition: [
        aivoov,
        "provider",
      ],
    },
    voice_id: {
      propDefinition: [
        aivoov,
        "voice_id",
        (c) => ({
          provider: c.provider,
        }),
      ],
    },
    transcribe_text: {
      propDefinition: [
        aivoov,
        "transcribe_text",
      ],
    },
    engine: {
      propDefinition: [
        aivoov,
        "engine",
      ],
    },
    transcribe_ssml_style: {
      propDefinition: [
        aivoov,
        "transcribe_ssml_style",
      ],
    },
    transcribe_ssml_spk_rate: {
      propDefinition: [
        aivoov,
        "transcribe_ssml_spk_rate",
      ],
    },
    transcribe_ssml_volume: {
      propDefinition: [
        aivoov,
        "transcribe_ssml_volume",
      ],
    },
    transcribe_ssml_pitch_rate: {
      propDefinition: [
        aivoov,
        "transcribe_ssml_pitch_rate",
      ],
    },
  },
  async run({ $ }) {
    const data = new FormData();
    for (let prop of [
      "media_data",
      "voice_id",
      "engine",
      "transcribe_ssml_style",
    ]) {
      if (this[prop]) {
        $.export(prop, this[prop]);
        data.append(prop, JSON.stringify(this[prop]));
      }
    }

    if (this.transcribe_text) {
      data.append("transcribe_text", JSON.stringify(this.transcribe_text));
    }

    if (this.transcribe_ssml_spk_rate) {
      data.append(
        "transcribe_ssml_spk_rate",
        this.transcribe_ssml_spk_rate + "%",
      );
    }
    if (this.transcribe_ssml_volume) {
      data.append("transcribe_ssml_volume", this.transcribe_ssml_volume + "dB");
    }
    if (this.transcribe_ssml_pitch_rate) {
      data.append(
        "transcribe_ssml_pitch_rate",
        this.transcribe_ssml_pitch_rate + "%",
      );
    }

    const response = await this.aivoov.transcribe({
      $,
      data,
      headers: {
        "Content-Type": "multipart/form-data",
        ...data.getHeaders(),
      },
    });
    $.export("$summary", "Successfully converted text to speech");
    return response;
  },
};
