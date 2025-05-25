import apipieAi from "../../apipie_ai.app.mjs";

export default {
  key: "apipie_ai-retrieve-available-llm-models",
  name: "Retrieve Available LLM Models",
  version: "0.0.1",
  description: "Returns a list of LLM models available through the API. [See the dashboard](https://apipie.ai/dashboard)",
  type: "action",
  props: {
    apipieAi,
  },
  async run({ $ }) {
    try {
      const response = await this.apipieAi.listLlmModels({
        $,
      });
      $.export("$summary", `Successfully retrieved ${response.data.length} available LLM model(s)!`);
      return response;
    } catch (e) {
      $.export("Error fetching LLM Models", e);
      throw new ConfigurationError(e.message || "Failed to fetch LLM Models");
    }
  },
};
