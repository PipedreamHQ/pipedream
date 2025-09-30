import { snakeCaseToTitleCase } from "../../common/utils.mjs";
import flexisign from "../../flexisign.app.mjs";

export default {
  key: "flexisign-send-document-using-template",
  name: "Send Document Using Template",
  description: "Sends a signature request to the specified recipients for a document generated from a template. [See the documentation](https://flexisign.io/app/integrations/flexisignapi)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    flexisign,
    templateId: {
      propDefinition: [
        flexisign,
        "templateId",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.templateId) {
      const { data: { bodyStructure } } = await this.flexisign.getTemplateDetails({
        params: {
          templateId: this.templateId,
        },
      });

      for (const [
        key,
        value,
      ] of Object.entries(bodyStructure)) {
        if ([
          "templateId",
          "recipientsCount",
        ].includes(key)) continue;

        const title = snakeCaseToTitleCase(key);
        props[key] = {
          type: typeof value === "number"
            ? "integer"
            : "string",
          label: title,
          description: title,
          default: typeof value === "number"
            ? value
            : undefined,
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      flexisign,
      ...data
    } = this;

    const response = await flexisign.sendSignatureRequest({
      $,
      data,
    });

    $.export("$summary", `Signature request sent for template ID: ${this.templateId}`);
    return response;
  },
};
