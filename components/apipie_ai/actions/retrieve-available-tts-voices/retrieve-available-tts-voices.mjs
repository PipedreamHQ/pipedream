import apipieAi from "../../apipie_ai.app.mjs";

export default {
  key: "apipie_ai-retrieve-available-tts-voices",
  name: "Retrieve Available TTS Voices",
  version: "0.0.1",
  description: "Returns a list of TTS Voices available through the API. [See the dashboard](https://apipie.ai/dashboard)",
  type: "action",
  props: {
    apipieAi,
  },
  async run({ $ }) {
    try {
      const response = await this.apipieAi.listVoices({
        $,
      });
      $.export("$summary", `Successfully retrieved ${response.data.length} available TTS Voices!`);
      return response;
    } catch (e) {
      $.export("Error fetching Voices", e);
      throw new ConfigurationError(e.message || "Failed to fetch Voices");
    }
  },
};
