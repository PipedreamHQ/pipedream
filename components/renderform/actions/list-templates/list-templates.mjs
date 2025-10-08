import app from "../../renderform.app.mjs";

export default {
  key: "renderform-list-templates",
  name: "List Templates",
  description: "Retrieve a list of your personal templates, optionally filtered by name. [See the documentation](https://renderform.io/docs/api/get-started/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    filterName: {
      type: "string",
      label: "Filter Name",
      description: "Filter templates by name",
      optional: true,
    },
  },
  async run({ $ }) {
    const templates = await this.app.listTemplates({
      filterName: this.filterName,
    });

    $.export("$summary", `Retrieved ${templates.length} templates`);

    return templates;
  },
};
