import aivoov from "../../aivoov.app.mjs";
import FormData from "form-data";

export default {
  key: "aivoov-convert-text-to-speech",
  name: "Convert Text to Speech",
  description:
    "Converts text to audio using the Aivoov API. [See the documentation](https://github.com/aivoov/aivoov-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    aivoov,
    provider: {
      propDefinition: [
        aivoov,
        "provider",
      ],
    },
    voiceId: {
      propDefinition: [
        aivoov,
        "voiceId",
        (c) => ({
          provider: c.provider,
        }),
      ],
    },
    transcribeText: {
      propDefinition: [
        aivoov,
        "transcribeText",
      ],
    },
    engine: {
      propDefinition: [
        aivoov,
        "engine",
      ],
    },
    transcribeSsmlStyle: {
      propDefinition: [
        aivoov,
        "transcribeSsmlStyle",
      ],
    },
    transcribeSsmlSpkRate: {
      propDefinition: [
        aivoov,
        "transcribeSsmlSpkRate",
      ],
    },
    transcribeSsmlVolume: {
      propDefinition: [
        aivoov,
        "transcribeSsmlVolume",
      ],
    },
    transcribeSsmlPitchRate: {
      propDefinition: [
        aivoov,
        "transcribeSsmlPitchRate",
      ],
    },
  },
  async run({ $ }) {
    const data = new FormData();
    if (this.voiceId) {
      data.append("voice_id", this.voiceId.replace("{engine}", "{{engine}}"));
    }

    if (this.transcribeText) {
      data.append("transcribe_text[]", JSON.stringify(this.transcribeText));
    }

    if (this.engine) {
      data.append("engine", this.engine);
    }

    if (this.transcribeSsmlStyle) {
      data.append("transcribe_ssml_style", this.transcribeSsmlStyle);
    }

    if (this.transcribeSsmlSpkRate) {
      data.append(
        "transcribe_ssml_spk_rate",
        this.transcribeSsmlSpkRate + "%",
      );
    }

    if (this.transcribeSsmlVolume) {
      data.append("transcribe_ssml_volume", this.transcribeSsmlVolume + "dB");
    }

    if (this.transcribeSsmlPitchRate) {
      data.append(
        "transcribe_ssml_pitch_rate",
        this.transcribeSsmlPitchRate + "%",
      );
    }

    const response = await this.aivoov.transcribe({
      $,
      data,
      headers: data.getHeaders(),
    });
    $.export("$summary", "Successfully converted text to speech");
    return response;
  },
};
