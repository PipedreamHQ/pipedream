import orshot from "../../orshot.app.mjs";

export default {
  key: "orshot-list-templates",
  name: "List Templates",
  description:
    "Retrieve a list of available library templates from Orshot. [See templates](https://orshot.com/templates)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    orshot,
  },
  async run({ $ }) {
    try {
      const templates = await this.orshot.listTemplates({
        $,
      });

      $.export(
        "$summary",
        `Successfully retrieved ${templates.length} templates`,
      );

      return {
        templates,
        count: templates.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const errorMessage = error.message || "Unknown error occurred";
      throw new Error(`Failed to list templates: ${errorMessage}`);
    }
  },
};
