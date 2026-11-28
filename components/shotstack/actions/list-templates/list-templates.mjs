import app from "../../shotstack.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "shotstack-list-templates",
  name: "List Templates",
  description: "List the templates saved in your Shotstack account, newest first, with each one's `id` and `name`. Use an `id` with **Get Template** to see its merge fields, or with **Render Template** to render it. [See the documentation](https://shotstack.io/docs/api/#list-templates)",
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
  },
  async run({ $ }) {
    const { response } = await this.app.listTemplates({
      $,
    });
    const templates = utils.newestFirst(response?.templates);
    $.export("$summary", `Found ${templates.length} templates`);
    return templates;
  },
};
