import elevenlabs from "../../elevenlabs.app.mjs";

export default {
  key: "elevenlabs-get-voices-with-descriptions",
  name: "Get Voices with Descriptions",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Fetches all available voices from ElevenLabs, including metadata like name, gender, accent, and category. [See the documentation](https://elevenlabs.io/docs/api-reference/voices/search)",
  type: "action",
  props: {
    elevenlabs,
  },
  async run({ $ }) {
    try {
      const { voices } = await this.elevenlabs.listVoices({
        $,
      });

      $.export("$summary", `Fetched ${voices.length} voices`);

      return voices;
    } catch (error) {
      $.export("$summary", `Failed to fetch voices: ${error.message}`);
      throw (error);
    }
  },
};
