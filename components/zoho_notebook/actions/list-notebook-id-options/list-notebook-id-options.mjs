import zoho_notebook from "../../zoho_notebook.app.mjs";

export default {
  key: "zoho_notebook-list-notebook-id-options",
  name: "List Notebook ID Options",
  description: "Retrieves available options for the Notebook ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_notebook,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await zoho_notebook.propDefinitions.notebookId.options
      .call(this.zoho_notebook, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
