import { axios } from "@pipedream/platform";

export default {
  name: "SerpApi",
  description: "SerpApi integration for Pipedream.",
  key: "serpapi",
  version: "0.0.7",
  type: "action",
  props: {
    apiKey: {
      type: "string",
      label: "api_key",
      description: "Your SerpApi API key",
      example: "YOUR_API_KEY_HERE",
      required: true,
    },
    parameters: {
      type: "object",
      label: "Parameters",
      description: "Query parameters for SerpApi, specific to search engines.",
      example: {
        "engine": "google",
        "q": "coffee",
      },
      required: true,
    },
  },
  async run({ $ }) {
    const apiKey = this.apiKey;
    const parameters = this.parameters;

    const url = `https://serpapi.com/search?api_key=${apiKey}&${new URLSearchParams(parameters).toString()}`;
    const response = await axios($, {
      url: url,
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      timeout: 10000,
    }).catch((err) => {
      throw new Error(`Failed to fetch data from SerpApi: ${err.response.status} - ${err.response.data}`);
    });

    if (!response) {
      throw new Error("No response from SerpApi");
    }

    if (response.search_metadata.status !== "Success") {
      throw new Error(`SerpApi error: ${response.search_metadata}`);
    }

    return response;
  },
};
