import app from "../../apipie_ai.app.mjs";

export default {
  key: "apipie_ai-fetch-models",
  name: "Fetch Models",
  description: "Fetch all available models or use one or more filters. [See the documentation](https://apipie.ai/docs/api/fetchmodels)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    type: {
      optional: true,
      propDefinition: [
        app,
        "modelType",
      ],
    },
    subtype: {
      propDefinition: [
        app,
        "modelSubtype",
      ],
    },
    provider: {
      optional: true,
      description: "Filter by provider of the model. Eg. `openrouter`.",
      propDefinition: [
        app,
        "provider",
      ],
    },
    enabled: {
      type: "boolean",
      label: "Enabled",
      description: "Only show enabled chat models.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      type,
      subtype,
      provider,
      enabled,
    } = this;

    const response = await this.app.fetchModels({
      $,
      params: {
        type,
        subtype,
        provider,
        enabled: +enabled,
      },
    });

    $.export("$summary", `Successfully fetched \`${response.data.length}\` model(s).`);
    return response.data;
  },
};
