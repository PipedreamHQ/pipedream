import app from "../../shotstack.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "shotstack-render-template",
  name: "Render Template",
  description: "Render a template saved in your Shotstack account, replacing its `{{ PLACEHOLDER }}` merge fields with your values. Fields you leave out keep the template's own values. Use **Get Template** to see its merge fields and their defaults. Each call starts and bills a new render. Rendering is asynchronous: use **Get Render Status** with the returned ID (and `waitSeconds`) to get the file URL. Use **Render From JSON** when you have a full edit instead. [See the documentation](https://shotstack.io/docs/api/#render-template).",
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
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
    },
    merge: {
      type: "object",
      label: "Merge Fields",
      description: "Placeholder name → value, e.g. `{\"TITLE\": \"Summer sale\", \"PRICE\": \"$19\"}`. Use **Get Template** to find the names (the `find` field). A value takes the type of the template's own value: `\"5\"` fills a number as `5`, `\"false\"` a true/false as `false`. Shotstack's list form `[{\"find\": \"TITLE\", \"replace\": \"Summer sale\"}]` works too.",
      optional: true,
    },
  },
  async run({ $ }) {
    const templateId = this.templateId.trim();
    const fields = utils.parse(this.merge);
    let merge;
    if (fields && Object.keys(fields).length) {
      const { response: template } = await this.app.getTemplate({
        $,
        templateId,
      });
      merge = utils.mergeOverTemplate(template?.template?.merge, fields);
    }
    const { response } = await this.app.renderTemplate({
      $,
      data: {
        id: templateId,
        merge,
      },
    });
    $.export("$summary", `Queued render ${response.id}. Use Get Render Status to get the file URL.`);
    return response;
  },
};
