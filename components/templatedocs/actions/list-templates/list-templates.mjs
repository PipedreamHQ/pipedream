import app from "../../templatedocs.app.mjs";

export default {
  key: "templatedocs-list-templates",
  name: "List Templates",
  description: "Retrieve a paginated list of templates. [See the documentation](https://templatedocs.io/docs/api/templates/list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    pageIndex: {
      type: "integer",
      label: "Page Index",
      description: "The 1-based page index to retrieve. Each page returns up to 100 templates. Defaults to 1.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listTemplates({
      $,
      params: {
        pageIndex: this.pageIndex,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.templates.length} template(s)`);
    return response;
  },
};
