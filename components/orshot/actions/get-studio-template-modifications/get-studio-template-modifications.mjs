import orshot from "../../orshot.app.mjs";

export default {
  key: "orshot-get-studio-template-modifications",
  name: "Get Studio Template Modifications",
  description: "Get available modification keys for a studio template",
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
        "studioTemplateId",
      ],
    },
  },
  async run({ $ }) {
    const { templateId } = this;

    try {
      const modifications = await this.orshot.getStudioTemplateModifications({
        $,
        params: {
          templateId,
        },
      });

      $.export(
        "$summary",
        `Successfully retrieved modifications for studio template ${templateId}`,
      );

      return {
        templateId,
        modifications,
        count: modifications.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const errorMessage = error.message || "Unknown error occurred";
      throw new Error(
        `Failed to get studio template modifications: ${errorMessage}`,
      );
    }
  },
};
