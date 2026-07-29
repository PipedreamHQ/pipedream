// x-pd-ai: optimized
import app from "../../writer.app.mjs";

export default {
  key: "writer-list-models",
  name: "List Models",
  description: "List the AI models available in your Writer account (Palmyra family plus any external models). "
    + "Use this to discover valid model ids and to recommend a model for a task, then pass the chosen `id` to **Send Prompt** as its `model`. "
    + "Example: call with no parameters -> returns models such as `{ id: \"palmyra-x5\", name: \"Palmyra X5\" }`, `{ id: \"palmyra-creative\", name: \"Palmyra Creative\" }`, `{ id: \"palmyra-med\", ... }`. "
    + "For creative writing pick `palmyra-creative`; for general generation `palmyra-x5`. "
    + "[See the documentation](https://dev.writer.com/api-reference/completion-api/list-models)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const { models = [] } = await this.app.listModels({
      $,
    });
    $.export("$summary", `Found ${models.length} available Writer model${models.length === 1
      ? ""
      : "s"}`);
    return models;
  },
};
