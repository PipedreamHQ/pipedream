import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-get-folder-canned-responses",
  name: "Get Canned Responses In A Folder",
  description: "View all the details of canned responses in a folder. [See the documentation](https://developers.freshdesk.com/api/#get_details_of_canned_responses_in_a_folder)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshdesk,
    cannedResponseFolderId: {
      propDefinition: [
        freshdesk,
        "cannedResponseFolderId",
      ],
    },
    maxResults: {
      propDefinition: [
        freshdesk,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      freshdesk, cannedResponseFolderId, maxResults,
    } = this;
    const responses = await freshdesk.getPaginatedResources({
      fn: freshdesk.getFolderCannedResponses,
      max: maxResults,
      args: {
        folderId: cannedResponseFolderId,
      },
    });
    $.export("$summary", `Successfully retrieved \`${responses.length}\` canned response(s) from folder`);
    return responses;
  },
};
