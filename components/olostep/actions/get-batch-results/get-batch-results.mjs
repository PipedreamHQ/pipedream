import olostep from "../../olostep.app.mjs";

export default {
  key: "olostep-get-batch-results",
  name: "Get Batch Results",
  description: "Get the status of a batch started with **Start Batch** and its completed items, optionally with each page's Markdown content. While `status` is `in_progress`, call it again later; items already completed are returned meanwhile. Use the returned `cursor` to get the next items. [See the documentation](https://docs.olostep.com/api-reference/batches/items)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    olostep,
    batchId: {
      type: "string",
      label: "Batch ID",
      description: "The ID of the batch, from the `id` field of **Start Batch**, e.g. `batch_51heltuqdq8y`",
    },
    includeContent: {
      propDefinition: [
        olostep,
        "includeContent",
      ],
    },
    limit: {
      propDefinition: [
        olostep,
        "limit",
      ],
      default: 10,
    },
    cursor: {
      propDefinition: [
        olostep,
        "cursor",
      ],
      description: "The `cursor` field from a previous **Get Batch Results** response for the same batch, to get the next items, e.g. `10`",
    },
  },
  async run({ $ }) {
    const batch = await this.olostep.getBatch({
      $,
      batchId: this.batchId,
    });
    const response = await this.olostep.listBatchItems({
      $,
      batchId: this.batchId,
      params: {
        status: "completed",
        limit: this.limit,
        cursor: this.cursor,
      },
    });
    const items = response?.items ?? [];
    if (this.includeContent) {
      await this.olostep.addMarkdown($, items);
    }
    $.export("$summary", `Batch is ${batch?.status}: retrieved ${items.length} completed item${items.length === 1
      ? ""
      : "s"}`);
    return {
      ...batch,
      items,
      cursor: response?.cursor,
    };
  },
};
