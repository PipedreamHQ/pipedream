import app from "../../shotstack.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "shotstack-get-render-status",
  name: "Get Render Status",
  description: "Get the status of a Shotstack render (`done`, `failed`, or an in-progress state such as `queued` or `rendering`) and, once it is `done`, its file URL. Use it after **Render From JSON**, **Render Template** or **Start Render**. Set `waitSeconds` (e.g. `30`) to keep checking inside one call; if it is still in progress, call again. [See the documentation](https://shotstack.io/docs/api/#get-render-status)",
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
    renderId: {
      propDefinition: [
        app,
        "renderId",
      ],
    },
    waitSeconds: {
      propDefinition: [
        app,
        "waitSeconds",
      ],
    },
  },
  async run({ $ }) {
    const renderId = this.renderId.trim();
    const isFinal = (r) => [
      "done",
      "failed",
    ].includes(r.status);
    const render = await utils.poll({
      seconds: this.waitSeconds,
      isFinal,
      check: async () => (await this.app.getRender({
        $,
        renderId,
        // Without this Shotstack sends back the whole submitted edit on every check.
        params: {
          data: false,
        },
      })).response,
    });
    const summary = utils.statusSummary("Render", render);
    $.export("$summary", isFinal(render)
      ? summary
      : `${summary}. Call again to get the file URL.`);
    return render;
  },
};
