import apipieAi from "../../apipie_ai.app.mjs";

export default {
  key: "apipie_ai-retrieve-available-image-models",
  name: "Retrieve Available Image Models",
  version: "0.0.1",
  description: "Returns a list of Image models available through the API. [See the dashboard](https://apipie.ai/dashboard)",
  type: "action",
  props: {
    apipieAi,
  },
  async run({ $ }) {
    const response = await this.apipieAi.listImageModels({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.data.length} available Image model(s)!`);
    return response;
  },
};
