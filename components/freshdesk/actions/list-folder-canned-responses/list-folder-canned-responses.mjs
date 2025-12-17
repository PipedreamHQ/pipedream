import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-list-folder-canned-responses",
  name: "List All Canned Responses In A Folder",
  description: "View all canned responses in a folder. [See the documentation](https://developers.freshdesk.com/api/#list_all_canned_responses_in_a_folder)",
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
  },
  async run({ $ }) {
    const {
      freshdesk,
      cannedResponseFolderId,
    } = this;
    const response = await freshdesk.listCannedResponses({
      $,
      cannedResponseFolderId,
    });
    const responseCount = response?.canned_responses?.length || 0;
    $.export("$summary", `Successfully retrieved \`${responseCount}\` canned response(s) from folder`);
    return response;
  },
};
