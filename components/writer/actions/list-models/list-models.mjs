import app from "../../writer.app.mjs";

export default {
  key: "writer-list-models",
  name: "List Models",
  description: "List the AI models available in your Writer account (Palmyra family plus any external models). "
    + "Use this to discover valid model ids and to recommend a model for a task, then pass the chosen `id` to **Send Prompt** as its `model`. "
    + "Example: call with no parameters -> returns models such as `{ id: \"palmyra-x5\", name: \"Palmyra X5\" }`, `{ id: \"palmyra-x4\", name: \"Palmyra X4\" }`, and any others enabled for the account. "
    + "`palmyra-x5` is the recommended general-purpose model (creative writing included); pick a different id from the returned list only for a specialized need. "
    + "[See the documentation](https://dev.writer.com/api-reference/completion-api/list-models)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
