import app from "../../shotstack.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "shotstack-get-generation-status",
  name: "Get Generation Status",
  description: "Get the status of a **Generate Asset** job (`done`, `failed`, or in progress such as `queued` or `processing`) and, once it is `done`, the asset's `url`. Set `waitSeconds` (e.g. `30`) to keep checking inside one call; if it is still in progress, call again. [See the documentation](https://shotstack.io/docs/api/#get-generation-status)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    generationId: {
      type: "string",
      label: "Generation ID",
      description: "The ID of a generation job, e.g. `8a1f2c3d-4e5b-5a6c-9d7e-1f2a3b4c5d6e`. **Generate Asset** returns it (the `id` field).",
    },
    waitSeconds: {
      propDefinition: [
        app,
        "waitSeconds",
      ],
    },
  },
  async run({ $ }) {
    const generationId = this.generationId.trim();
    const job = await utils.poll({
      seconds: this.waitSeconds,
      isFinal: utils.isGenerationFinal,
      check: () => this.app.getGeneration({
        $,
        generationId,
      }),
    });
    const summary = utils.statusSummary("Generation", job);
    $.export("$summary", utils.isGenerationFinal(job)
      ? summary
      : `${summary}. Call again to get the URL.`);
    return job;
  },
};
