import { ConfigurationError } from "@pipedream/platform";
import app from "../../perplexity.app.mjs";

export default {
  key: "perplexity-create-response",
  name: "Create Response (Agent API)",
  description: "Creates a response using the Agent API with presets, third-party models, and tools. [See the documentation](https://docs.perplexity.ai/api-reference/responses-post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    preset: {
      propDefinition: [
        app,
        "preset",
      ],
    },
    agentModel: {
      propDefinition: [
        app,
        "agentModel",
      ],
    },
    input: {
      propDefinition: [
        app,
        "input",
      ],
    },
    tools: {
      propDefinition: [
        app,
        "tools",
      ],
    },
    temperature: {
      propDefinition: [
        app,
        "temperature",
      ],
    },
  },
  async run({ $ }) {
    if (!this.preset && !this.agentModel) {
      throw new ConfigurationError("Either **Preset** or **Model** must be provided.");
    }

    let tools;
    try {
      tools = this.tools?.map((t) =>
        typeof t === "string"
          ? JSON.parse(t)
          : t);
    } catch (error) {
      throw new ConfigurationError("Invalid JSON in tools array: each element must be a valid JSON string.");
    }

    const data = {
      input: this.input,
      ...(this.preset && {
        preset: this.preset,
      }),
      ...(this.agentModel && {
        model: this.agentModel,
      }),
      ...(tools?.length && {
        tools,
      }),
      ...(this.temperature != null && {
        temperature: +this.temperature,
      }),
    };

    const response = await this.app.createResponse({
      $,
      data,
    });

    if (response?.id) {
      $.export("$summary", `Successfully created response \`${response.id}\`.`);
    }
    return response;
  },
};
