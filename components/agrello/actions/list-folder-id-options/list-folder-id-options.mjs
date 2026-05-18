import agrello from "../../agrello.app.mjs";

export default {
  key: "agrello-list-folder-id-options",
  name: "List Folder ID Options",
  description: "Retrieves available options for the Folder ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    agrello,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await agrello.propDefinitions.folderId.options
      .call(this.agrello, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
