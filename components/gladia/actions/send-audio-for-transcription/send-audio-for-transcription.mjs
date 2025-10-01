import {
  ConfigurationError, getFileStreamAndMetadata,
} from "@pipedream/platform";
import FormData from "form-data";
import { camelToSnakeCase } from "../../common/utils.mjs";
import gladia from "../../gladia.app.mjs";

export default {
  key: "gladia-send-audio-for-transcription",
  name: "Send Audio For Transcription",
  description: "Sends audio to Gladia for transcription and optional translation. [See the documentation](https://docs.gladia.io/reference/pre-recorded)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gladia,
    audio: {
      type: "string",
      label: "Audio File or URL",
      description: "Provide an audio file URL or a path to a file in the `/tmp` directory.",
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
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
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
    if (!this.audio) {
      throw new ConfigurationError("The Audio File or URL field is required.");
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
    const {
      stream,
      metadata,
    } = await getFileStreamAndMetadata(audio);
    formData.append("audio", stream, {
      filename: metadata.name,
    });
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
