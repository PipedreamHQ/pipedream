import app from "../../api4ai.app.mjs";
import { retryWithExponentialBackoff } from "../../common/utils.mjs";

export default {
  name: "Alcohol Label Recognition",
  description: "Accurately identifies alcohol labels using advanced intelligent technologies. Powered by API4AI.",
  key: "api4ai-alcohol-label-recognition",
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
      content: "Subscribe to [API4AI Alcohol Label Recognition](https://rapidapi.com/api4ai-api4ai-default/api/alcohol-label-recognition/pricing) on the RapidAPI hub before you start using it.",
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
    let labels = "";

    // Perform request and parse results.
    const cb = () =>
      this.app.makeRequest(
        $,
        "https://alcohol-label-recognition.p.rapidapi.com/v1/results",
        this.image,
      );
    const response = await retryWithExponentialBackoff(cb);
    const isOk = response?.results?.[0]?.status?.code === "ok";
    summary = response?.results?.[0]?.status?.message || JSON.stringify(response);
    if (isOk) {
      labels = response.results[0].entities[0].array;
    }
    else {
      throw new Error(summary);
    }

    $.export("$summary", summary);
    $.export("labels", labels);
  },
};
