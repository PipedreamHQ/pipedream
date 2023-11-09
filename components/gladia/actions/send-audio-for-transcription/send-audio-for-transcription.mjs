import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";
import {
  camelToSnakeCase, checkTmp,
} from "../../common/utils.mjs";
import gladia from "../../gladia.app.mjs";

export default {
  key: "gladia-send-audio-for-transcription",
  name: "Send Audio For Transcription",
  description: "Sends audio to Gladia for transcription and optional translation. [See the documentation](https://docs.gladia.io/reference/pre-recorded)",
  version: "0.0.1",
  type: "action",
  props: {
    gladia,
    audio: {
      propDefinition: [
        gladia,
        "audio",
      ],
      optional: true,
    },
    audioUrl: {
      propDefinition: [
        gladia,
        "audioUrl",
      ],
      optional: true,
    },
    toggleNoiseReduction: {
      propDefinition: [
        gladia,
        "toggleNoiseReduction",
      ],
      optional: true,
    },
    transcriptionHint: {
      propDefinition: [
        gladia,
        "transcriptionHint",
      ],
      optional: true,
    },
    toggleDiarization: {
      propDefinition: [
        gladia,
        "toggleDiarization",
      ],
      optional: true,
    },
    targetTranslationLanguage: {
      propDefinition: [
        gladia,
        "targetTranslationLanguage",
      ],
      optional: true,
    },
    toggleDirectTranslate: {
      propDefinition: [
        gladia,
        "toggleDirectTranslate",
      ],
      optional: true,
    },
    languageBehaviour: {
      propDefinition: [
        gladia,
        "languageBehaviour",
      ],
      reloadProps: true,
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.languageBehaviour === "manual") {
      props.language = {
        type: "string",
        label: "Language",
        description: "If language_behaviour is set to manual, define the language to use for the transcription",
      };
    }
    return props;
  },
  async run({ $ }) {
    if (!this.audio && !this.audioUrl) {
      throw new ConfigurationError("You must provite whether **Audio** or **Audio URL**.");
    }

    const {
      gladia,
      audio,
      toggleNoiseReduction,
      toggleDiarization,
      toggleDirectTranslate,
      ...data
    } = this;

    const formData = new FormData();
    if (audio) {
      const filePath = checkTmp(audio);
      formData.append("audio", fs.createReadStream(filePath));
    }
    formData.append("toggle_noise_reduction", `${toggleNoiseReduction}`);
    formData.append("toggle_diarization", `${toggleDiarization}`);
    formData.append("toggle_direct_translate", `${toggleDirectTranslate}`);

    for (const [
      key,
      value,
    ] of Object.entries(data)) {
      formData.append(`${camelToSnakeCase(key)}`, value);
    }
    const response = await gladia.sendAudioForTranscription({
      data: formData,
      headers: formData.getHeaders(),
    });

    $.export("$summary", "The audio was successfully transcripted!");
    return response;
  },
};
