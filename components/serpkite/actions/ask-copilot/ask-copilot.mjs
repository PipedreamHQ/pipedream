import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-ask-copilot",
  name: "Ask Copilot Search",
  description: "Ask Microsoft Copilot Search, Bing's AI answer, and get its answer with cited sources and the product cards beside it. Usually answers in 15-40 s. Set the workflow's **Execution Timeout Limit** (workflow Settings) to at least 120 seconds: HTTP-triggered workflows default to 30 seconds. Failed, refused and empty answers are not billed ([see pricing](https://serpkite.com/pricing)). [See the documentation](https://serpkite.com/docs/endpoints/copilot)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    prompt: {
      propDefinition: [
        app,
        "prompt",
      ],
    },
    country: {
      type: "string",
      label: "Country",
      description: "Bing market country, such as `us` or `de`.",
      optional: true,
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
    track: {
      propDefinition: [
        app,
        "track",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.askAssistant({
      $,
      assistant: "copilot",
      data: {
        prompt: this.prompt,
        country: this.country,
        language: this.language,
        track: this.track,
      },
    });
    $.export("$summary", response.text
      ? `Copilot Search answered with ${response.sources?.length ?? 0} sources`
      : "Copilot Search returned no answer (not billed)");
    return response;
  },
};
