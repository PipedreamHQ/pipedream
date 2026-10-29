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
      description: "Make ChatGPT search the web (default `true`); `false` lets it decide.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Ask as a visitor in this country, such as `us` or `de`: prices, shops and places follow it.",
      optional: true,
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
      assistant: "chatgpt",
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
