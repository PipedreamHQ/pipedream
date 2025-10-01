import orshot from "../../orshot.app.mjs";

export default {
  key: "orshot-get-template-modifications",
  name: "Get Template Modifications",
  description: "Get available modification keys for a library template",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    orshot,
    templateId: {
      propDefinition: [
        orshot,
        "templateId",
      ],
      description: "The ID of the template to get modifications for",
    },
  },
  async run({ $ }) {
    const { templateId } = this;

    try {
      const modifications = await this.orshot.getTemplateModifications({
        $,
        params: {
          templateId,
        },
      });

      $.export(
        "$summary",
        `Successfully retrieved modifications for template ${templateId}`,
      );

      return {
        templateId,
        modifications,
        count: modifications.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const errorMessage = error.message || "Unknown error occurred";
      throw new Error(`Failed to get template modifications: ${errorMessage}`);
    }
  },
};
