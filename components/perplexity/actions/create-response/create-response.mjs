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
    readOnlyHint: true,
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
    stream: {
      propDefinition: [
        app,
        "stream",
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

    const tools = this.tools?.map((t) =>
      typeof t === "string"
        ? JSON.parse(t)
        : t);

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
      ...(this.stream != null && {
        stream: this.stream,
      }),
      ...(this.temperature != null && {
        temperature: +this.temperature,
      }),
    };

    const response = await this.app.createResponse({
      $,
      data,
    });

    $.export("$summary", `Successfully created response \`${response.id}\`.`);
    return response;
  },
};
