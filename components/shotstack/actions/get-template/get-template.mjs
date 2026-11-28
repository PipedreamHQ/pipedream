import app from "../../shotstack.app.mjs";

export default {
  key: "shotstack-get-template",
  name: "Get Template",
  description: "Get a saved template's merge fields: each placeholder's name (`find`) and the template's own value (`replace`). Call it before **Render Template** to know which fields to fill. Returns `id`, `name` and `merge`. [See the documentation](https://shotstack.io/docs/api/#retrieve-template)",
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
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const templateId = this.templateId.trim();
    const { response } = await this.app.getTemplate({
      $,
      templateId,
    });
    const merge = response?.template?.merge || [];
    $.export("$summary", `Template "${response?.name || templateId}" has ${merge.length} merge fields`);
    return {
      id: response?.id,
      name: response?.name,
      merge,
    };
  },
};
