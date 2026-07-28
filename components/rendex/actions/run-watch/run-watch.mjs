import rendex from "../../rendex.app.mjs";

export default {
  key: "rendex-run-watch",
  name: "Run Watch Now",
  description: "Trigger an immediate check for a watch. The run is queued and its diff result is produced asynchronously — poll **List Watch Runs** for the completed run. [See the documentation](https://rendex.dev/docs/watch#endpoints).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    rendex,
    watchId: {
      propDefinition: [
        rendex,
        "watchId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rendex.runWatch(this.watchId, {
      $,
    });

    const result = response.data;
    $.export("$summary", `Queued run ${result?.runId} for watch ${this.watchId}`);
    return result;
  },
};
