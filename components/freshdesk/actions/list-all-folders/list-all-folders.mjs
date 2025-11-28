import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-list-all-folders",
  name: "List All Folders",
  description: "View all the canned response folders. [See the documentation](https://developers.freshdesk.com/api/#list_all_canned_response_folders)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshdesk,
    maxResults: {
      propDefinition: [
        freshdesk,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      freshdesk, maxResults,
    } = this;
    const folders = await freshdesk.getPaginatedResources({
      fn: freshdesk.listCannedResponseFolders,
      max: maxResults,
      args: {},
    });
    $.export("$summary", `Successfully retrieved \`${folders.length}\` folder(s)`);
    return folders;
  },
};
