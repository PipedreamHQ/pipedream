import aivoov from "../../aivoov.app.mjs"

export default {
  key: "aivoov-convert-text-to-speech",
  name: "Convert Text to Speech",
  description: "Converts text to audio using the transcribe endpoint of Aivoov API",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    aivoov,
    provider: aivoov.propDefinitions.provider,
    voice_id: aivoov.propDefinitions.voice_id,
    transcribe_text: aivoov.propDefinitions.transcribe_text,
    engine: aivoov.propDefinitions.engine,
    transcribe_ssml_style: aivoov.propDefinitions.transcribe_ssml_style,
    transcribe_ssml_spk_rate: aivoov.propDefinitions.transcribe_ssml_spk_rate,
    transcribe_ssml_volume: aivoov.propDefinitions.transcribe_ssml_volume,
    transcribe_ssml_pitch_rate: aivoov.propDefinitions.transcribe_ssml_pitch_rate,
  },
  async run({ $ }) {
    const response = await this.aivoov.transcribe({
      provider: this.provider,
      voice_id: this.voice_id,
      transcribe_text: this.transcribe_text,
      engine: this.engine,
      transcribe_ssml_style: this.transcribe_ssml_style,
      transcribe_ssml_spk_rate: this.transcribe_ssml_spk_rate,
      transcribe_ssml_volume: this.transcribe_ssml_volume,
      transcribe_ssml_pitch_rate: this.transcribe_ssml_pitch_rate,
    });
    $.export("$summary", "Successfully converted text to speech");
    return response;
  },
};