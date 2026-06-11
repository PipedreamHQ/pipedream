import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-list-canned-response-folder-id-options",
  name: "List Canned Response Folder ID Options",
  description: "Retrieves available options for the Canned Response Folder ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    freshdesk,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await freshdesk.propDefinitions.cannedResponseFolderId.options
      .call(this.freshdesk, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
