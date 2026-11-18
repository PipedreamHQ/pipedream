import olostep from "../../olostep.app.mjs";

export default {
  key: "olostep-get-batch-results",
  name: "Get Batch Results",
  description: "Get the status of a batch and its completed items, optionally with each page's Markdown content. [See the documentation](https://docs.olostep.com/api-reference/batches/items)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    olostep,
    batchId: {
      type: "string",
      label: "Batch ID",
      description: "The `id` returned by the **Start Batch** action",
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
    },
    cursor: {
      propDefinition: [
        olostep,
        "cursor",
      ],
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
