import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-ask-chatgpt",
  name: "Ask ChatGPT",
  description: "Ask ChatGPT as a logged-out visitor (searching the web) and get its answer as Markdown with the sources it cited and the products and places it showed. Usually answers in 10-30 s. Set the workflow's **Execution Timeout Limit** (workflow Settings) to at least 120 seconds: HTTP-triggered workflows default to 30 seconds. Failed, refused and empty answers are not billed ([see pricing](https://serpkite.com/pricing)). [See the documentation](https://serpkite.com/docs/endpoints/chatgpt)",
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
    webSearch: {
      type: "boolean",
      label: "Web Search",
      description: "Make ChatGPT search the web, e.g. `false`. Defaults to `true`; `false` lets ChatGPT decide whether to search.",
      optional: true,
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
      description: "Ask as a visitor in this country, as a two-letter ISO 3166-1 alpha-2 code: prices, shops and places follow it, e.g. `us` or `de`.",
    },
    track: {
      propDefinition: [
        app,
        "track",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.askChatgpt({
      $,
      data: {
        prompt: this.prompt,
        web_search: this.webSearch,
        country: this.country,
        track: this.track,
      },
    });
    $.export("$summary", response.text
      ? `ChatGPT answered with ${response.sources?.length ?? 0} sources`
      : "ChatGPT returned no answer (not billed)");
    return response;
  },
};
