import app from "../../api4ai.app.mjs";
import { retryWithExponentialBackoff } from "../../common/utils.mjs";

export default {
  name: "Furniture & Household Item Recognition",
  description: "This API provides identification of furniture & household items with advanced intelligent detection, categorization, and counting technologies. Powered by API4AI.",
  key: "api4ai-furniture-and-household-item-recognition",
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
      content: "Subscribe to [API4AI Furniture and Household Items Recognition](https://rapidapi.com/api4ai-api4ai-default/api/furniture-and-household-items/pricing) on the RapidAPI hub before you start using it.",
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
    let items = "";

    // Perform request and parse results.
    const cb = () =>
      this.app.makeRequest(
        $,
        "https://furniture-and-household-items.p.rapidapi.com/v1/results",
        this.image,
      );
    const response = await retryWithExponentialBackoff(cb);
    const isOk = response?.results?.[0]?.status?.code === "ok";
    summary = response?.results?.[0]?.status?.message || JSON.stringify(response);
    if (isOk) {
      items = response.results[0].entities[0].mapping;
    }
    else {
      throw new Error(summary);
    }

    $.export("$summary", summary);
    $.export("items", items);
  },
};
