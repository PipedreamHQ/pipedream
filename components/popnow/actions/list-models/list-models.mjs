import app from "../../popnow.app.mjs";

export default {
  key: "popnow-list-models",
  name: "List Models",
  description: "List the image, video and audio models your API key can call, with their USD rate snapshots. [See the documentation](https://popnow.ai/docs/models)",
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
    modality: {
      propDefinition: [
        app,
        "modality",
      ],
    },
    provider: {
      type: "string",
      label: "Provider",
      description: "Only list models from this exact model creator, for example `google`.",
      optional: true,
    },
    task: {
      type: "string",
      label: "Task",
      description: "Only list models that support this exact task, for example `text-to-image` or `image-to-video`.",
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "Free-text search over model names.",
      optional: true,
    },
    includeSchema: {
      type: "boolean",
      label: "Include Schema",
      description: "Include each model's input JSON Schema in the response.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listModels({
      $,
      params: {
        modality: this.modality,
        provider: this.provider,
        task: this.task,
        search: this.search,
        includeSchema: this.includeSchema,
      },
    });
    const count = response?.items?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} model(s)`);
    return response;
  },
};
