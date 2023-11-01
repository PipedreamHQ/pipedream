import gladia from "../../gladia.app.mjs";

export default {
  key: "gladia-send-audio-for-transcription",
  name: "Send Audio for Transcription",
  description: "Sends audio to Gladia for transcription and optional translation. [See the documentation](https://docs.gladia.io/reference/pre-recorded)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gladia,
    audio_url: {
      propDefinition: [
        gladia,
        "audio_url",
      ],
    },
    language_behaviour: {
      propDefinition: [
        gladia,
        "language_behaviour",
      ],
    },
    language: {
      propDefinition: [
        gladia,
        "language",
      ],
    },
    toggle_noise_reduction: {
      propDefinition: [
        gladia,
        "toggle_noise_reduction",
      ],
    },
    transcription_hint: {
      propDefinition: [
        gladia,
        "transcription_hint",
      ],
    },
    toggle_diarization: {
      propDefinition: [
        gladia,
        "toggle_diarization",
      ],
    },
    translate_audio: {
      propDefinition: [
        gladia,
        "translate_audio",
      ],
    },
    target_translation_language: {
      propDefinition: [
        gladia,
        "target_translation_language",
        (c) => ({
          translate_audio: c.translate_audio,
        }),
      ],
    },
    toggle_direct_translate: {
      propDefinition: [
        gladia,
        "toggle_direct_translate",
        (c) => ({
          toggle_direct_translate: c.translate_audio,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gladia.sendAudioForTranscription({
      audio_url: this.audio_url,
      language_behaviour: this.language_behaviour,
      language: this.language,
      toggle_noise_reduction: this.toggle_noise_reduction,
      transcription_hint: this.transcription_hint,
      toggle_diarization: this.toggle_diarization,
      toggle_direct_translate: this.translate_audio
        ? this.toggle_direct_translate
        : undefined,
      target_translation_language: this.translate_audio
        ? this.target_translation_language
        : undefined,
    });
    $.export("$summary", "Successfully sent audio for transcription");
    return response;
  },
};
