import bannerify from "../../bannerify.app.mjs";

export default {
  key: "bannerify-list-templates",
  name: "List Templates",
  description: "List templates in the connected Bannerify project. [See the documentation](https://bannerify.co/docs/integrations/pipedream)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    bannerify,
    includeLayers: {
      type: "boolean",
      label: "Include Layers",
      description: "Whether to include template layer details in the response.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const templates = await this.bannerify.listTemplates({
      $,
      includeLayers: this.includeLayers,
    });

    $.export("$summary", `Successfully retrieved ${templates.length} templates`);

    return templates;
  },
};
