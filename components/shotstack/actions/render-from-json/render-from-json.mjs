import { ConfigurationError } from "@pipedream/platform";
import app from "../../shotstack.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "shotstack-render-from-json",
  name: "Render From JSON",
  description: "Render a video, image or audio file from a full Shotstack edit (timeline plus output settings). Each call starts a new render (Production renders use credits). Rendering is asynchronous: use **Get Render Status** with the returned ID (and `waitSeconds`) to get the file URL, or set a Callback URL. Use **Render Template** for a template saved in the account. Prefer this over **Start Render**, which takes the timeline and output settings as separate fields. [See the documentation](https://shotstack.io/docs/api/#render-asset)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    edit: {
      type: "string",
      label: "Edit (JSON)",
      description: "A Shotstack edit: a `timeline` of tracks and clips, plus `output` settings. Example: `{\"timeline\": {\"tracks\": [{\"clips\": [{\"asset\": {\"type\": \"title\", \"text\": \"Hello from Pipedream\", \"style\": \"minimal\"}, \"start\": 0, \"length\": 3}]}]}, \"output\": {\"format\": \"mp4\", \"resolution\": \"sd\"}}`. [See the edit reference](https://shotstack.io/docs/api/#tocs_edit).",
    },
    callback: {
      propDefinition: [
        app,
        "callback",
      ],
      description: "A URL Shotstack posts the finished or failed render to, e.g. `https://example.com/webhooks/shotstack`. Leave empty to keep any `callback` already in the edit.",
      optional: true,
    },
  },
  async run({ $ }) {
    const edit = utils.parse(this.edit);
    if (!edit || typeof edit !== "object" || Array.isArray(edit)) {
      throw new ConfigurationError("Edit must be a JSON object with a `timeline` and an `output`.");
    }
    const { response } = await this.app.createRender({
      $,
      data: {
        ...edit,
        callback: this.callback?.trim() || edit.callback,
      },
    });
    $.export("$summary", `Queued render ${response.id}. Use Get Render Status to get the file URL.`);
    return response;
  },
};
