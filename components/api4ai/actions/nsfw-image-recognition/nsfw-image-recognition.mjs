import app from "../../api4ai.app.mjs";
import { retryWithExponentialBackoff } from "../../common/utils.mjs";

export default {
  name: "NSFW Image Recognition",
  description:
    "Content moderation solution for NSFW (Not Safe For Work) sexual images identification. Powered by API4AI.",
  key: "api4ai-nsfw-image-recognition",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    alert: {
      type: "alert",
      alertType: "info",
      content: "Subscribe to [API4AI NSFW](https://rapidapi.com/api4ai-api4ai-default/api/nsfw3/pricing) on the RapidAPI hub before you start using it.",
    },
    image: {
      propDefinition: [
        app,
        "image",
      ],
    },
    strictness: {
      type: "string",
      label: "Strictness",
      description:
        "Algorithm strictness. Use float values in range from 0.0 (less strict) to 1.0 (strict).",
      optional: true,
      default: "1.0",
    },
  },
  async run({ $ }) {
    // Initialize output.
    let summary = "";
    let nsfw = -1;

    // Perform request and parse results.
    const cb = () =>
      this.app.makeRequest(
        $,
        "https://nsfw3.p.rapidapi.com/v1/results",
        this.image,
        {
          strictness: this.strictness,
        },
      );
    const response = await retryWithExponentialBackoff(cb);
    const isOk = response?.results?.[0]?.status?.code === "ok";
    summary = response?.results?.[0]?.status?.message || JSON.stringify(response);
    if (isOk) {
      nsfw = response.results[0].entities[0].classes.nsfw;
    }
    else {
      throw new Error(summary);
    }

    $.export("$summary", summary);
    $.export("nsfw", nsfw);
  },
};
