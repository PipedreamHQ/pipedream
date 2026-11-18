import olostep from "../../olostep.app.mjs";

export default {
  key: "olostep-start-batch",
  name: "Start Batch",
  description: "Start scraping a list of URLs in one batch. The batch runs in the background; use **Get Batch Results** with the returned `id` to get the pages. [See the documentation](https://docs.olostep.com/api-reference/batches/create)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    olostep,
    urls: {
      type: "string[]",
      label: "URLs",
      description: "The URLs to scrape, including `https://`",
    },
    country: {
      propDefinition: [
        olostep,
        "country",
      ],
    },
    webhook: {
      propDefinition: [
        olostep,
        "webhook",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.olostep.startBatch({
      $,
      data: {
        items: this.urls.map((url, index) => ({
          custom_id: String(index),
          url,
        })),
        country: this.country,
        webhook: this.webhook,
      },
    });
    $.export("$summary", `Started batch ${response?.id} with ${this.urls.length} URL${this.urls.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
