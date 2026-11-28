import app from "../../shotstack.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "shotstack-render-template",
  name: "Render Template",
  description: "Render a template saved in your Shotstack account, replacing its `{{ PLACEHOLDER }}` merge fields with your values. Fields you leave out keep the template's own values. Use **Get Template** to see its merge fields and their defaults. Each call starts a new render (Production renders use credits). Rendering is asynchronous: use **Get Render Status** with the returned ID (and `waitSeconds`) to get the file URL. Use **Render From JSON** when you have a full edit instead. [See the documentation](https://shotstack.io/docs/api/#render-template)",
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
      description: "Placeholder name → value, e.g. `{\"TITLE\": \"Summer sale\", \"PRICE\": \"$19\"}`. Use **Get Template** to find the names (the `find` field). Fields you leave out keep the template's values; `\"\"` clears one. A value takes the type of the template's own value: `\"5\"` fills a number as `5`, `\"false\"` a true/false as `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const templateId = this.templateId.trim();
    const fields = utils.parse(this.merge);
    let merge;
    let unknown = [];
    if (fields && Object.keys(fields).length) {
      const { response: saved } = await this.app.getTemplate({
        $,
        templateId,
      });
      const known = new Set((saved?.template?.merge || []).map((f) => f?.find));
      merge = utils.mergeOverTemplate(saved?.template?.merge, fields);
      unknown = merge.map((f) => f.find).filter((name) => !known.has(name));
    }
    const { response } = await this.app.renderTemplate({
      $,
      data: {
        id: templateId,
        merge,
      },
    });
    // A misspelled name would otherwise render the template's default with no sign of why.
    const note = unknown.length
      ? ` Not among the template's merge fields (sent as extra fields): ${unknown.join(", ")}.`
      : "";
    $.export("$summary", `Queued render ${response.id}.${note} Use Get Render Status to get the file URL.`);
    return response;
  },
};
