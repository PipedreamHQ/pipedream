import elevenlabs from "../../elevenlabs.app.mjs";

export default {
  key: "get-voices-with-descriptions",
  name: "Get Voices with Descriptions",
  version: "0.0.1",
  description: "Fetches all available voices from ElevenLabs, including metadata like name, gender, accent, and category. [API Docs](https://docs.elevenlabs.io/api-reference/voices/list)",
  type: "action",
  props: {
    elevenlabs,
  },
  async run({ $ }) {
    const { voices } = await this.elevenlabs.listVoices({ $ });

    $.export("$summary", `Fetched ${voices.length} voices`);

    return voices;
  },
};