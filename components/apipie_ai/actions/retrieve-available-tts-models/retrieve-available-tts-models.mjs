import apipieAi from "../../apipie_ai.app.mjs";

export default {
  key: "apipie_ai-retrieve-available-tts-models",
  name: "Retrieve Available TTS Models",
  version: "0.0.1",
  description: "Returns a list of TTS models available through the API. [See the dashboard](https://apipie.ai/dashboard)",
  type: "action",
  props: {
    apipieAi,
  },
  async run({ $ }) {
    try {
      const response = await this.apipieAi.listTtsModels({
        $,
      });
      $.export("$summary", `Successfully retrieved ${response.data.length} available TTS model(s)!`);
      return response;
    } catch (e) {
      $.export("Error fetching TTS Models", e);
      throw new ConfigurationError(e.message || "Failed to fetch TTS models");
    }
  },
};
