import firma from "../../firma.app.mjs";

export default {
  key: "firma-get-template",
  name: "Get Template",
  description: "Retrieves one Firma template by its UUID, including its recipients (the template users, each with `id`, `designation` and `order`) and fields. Use it before **Create and Send Signing Request** to see which signing roles need a recipient: pass each role's `recipients[].id` as `template_user_id`. Use **List Templates** to find a template ID. [See the documentation](https://docs.firma.dev/api-reference/templates/get-template)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    firma,
    templateId: {
      propDefinition: [
        firma,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.firma.getTemplate({
      $,
      templateId: this.templateId,
    });
    $.export("$summary", `Retrieved template "${response.name || this.templateId}" with ${response.recipients?.length ?? 0} recipient(s)`);
    return response;
  },
};
