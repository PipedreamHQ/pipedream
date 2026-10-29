import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-ask-ai-mode",
  name: "Ask Google AI Mode",
  description: "Ask Google AI Mode, Google's conversational search, and get its answer with the sources it cited. Usually answers in 5-45 s. Set the workflow's **Execution Timeout Limit** (workflow Settings) to at least 120 seconds: HTTP-triggered workflows default to 30 seconds. Failed, refused and empty answers are not billed ([see pricing](https://serpkite.com/pricing)). [See the documentation](https://serpkite.com/docs/endpoints/ai_mode)",
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
      description: "The country Google answers for, such as `us` or `de`.",
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
      assistant: "ai_mode",
      data: {
        prompt: this.prompt,
        country: this.country,
        language: this.language,
        track: this.track,
      },
    });
    $.export("$summary", response.text
      ? `Google AI Mode answered with ${response.sources?.length ?? 0} sources`
      : "Google AI Mode returned no answer (not billed)");
    return response;
  },
};
