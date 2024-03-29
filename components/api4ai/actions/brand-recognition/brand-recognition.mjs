import app from "../../api4ai.app.mjs";
import { retryWithExponentialBackoff } from "../../common/utils.mjs";

export default {
  name: "Brand Recognition",
  description: "The service processes input image and responds with a list of found brand logos. Powered by API4AI.",
  key: "api4ai-brand-recognition",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    apiKey: {
      propDefinition: [
        app,
        "apiKey",
      ],
      description:
        "Subscribe to [API4AI Brand Recognition](https://rapidapi.com/api4ai-api4ai-default/api/brand-recognition/pricing) on the RapidAPI hub to obtain an API Key.",
    },
    image: {
      propDefinition: [
        app,
        "image",
      ],
    },
  },
  async run({ $ }) {
    // Initialize output.
    let summary = "";
    let brands = "";

    // Perform request and parse results.
    const cb = () =>
      this.app.makeRequest(
        $,
        "https://brand-recognition.p.rapidapi.com/v2/results",
        this.apiKey,
        this.image,
      );
    const response = await retryWithExponentialBackoff(cb);
    const isOk = response?.results?.[0]?.status?.code === "ok";
    summary = response?.results?.[0]?.status?.message || JSON.stringify(response);
    if (isOk) {
      brands = response.results[0].entities[0].strings;
    }
    else {
      throw new Error(summary);
    }

    $.export("$summary", summary);
    $.export("brands", brands);
  },
};
