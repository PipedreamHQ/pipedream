import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-ask-brave-ai",
  name: "Ask Brave AI",
  description: "Ask Brave Search's AI answer and get it with cited sources, the searches it ran and the products it showed. Usually answers in 1-10 s. Failed, refused and empty answers are not billed ([see pricing](https://serpkite.com/pricing)). [See the documentation](https://serpkite.com/docs/endpoints/brave_ai)",
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
      description: "Brave market country, such as `us` or `de`.",
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
      assistant: "brave_ai",
      data: {
        prompt: this.prompt,
        country: this.country,
        language: this.language,
        track: this.track,
      },
    });
    $.export("$summary", response.text
      ? `Brave AI answered with ${response.sources?.length ?? 0} sources`
      : "Brave AI returned no answer (not billed)");
    return response;
  },
};
