import templatefox from "../../templatefox.app.mjs";

export default {
  key: "templatefox-list-templates",
  name: "List Templates",
  description: "List all available PDF templates in your TemplateFox account. [See the documentation](https://pdftemplateapi.com/docs/api/list-templates)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    templatefox,
  },
  async run({ $ }) {
    const response = await this.templatefox.listTemplates({
      $,
    });
    const count = response.templates?.length ?? 0;
    $.export("$summary", `Found ${count} template${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
