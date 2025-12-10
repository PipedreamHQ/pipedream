import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-get-canned-response",
  name: "Get Canned Response",
  description: "View a Canned Response. [See the documentation](https://developers.freshdesk.com/api/#view_a_canned_response)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    freshdesk,
    cannedResponseFolderId: {
      propDefinition: [
        freshdesk,
        "cannedResponseFolderId",
      ],
    },
    cannedResponseId: {
      propDefinition: [
        freshdesk,
        "cannedResponseId",
        ({ cannedResponseFolderId }) => ({
          cannedResponseFolderId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      freshdesk,
      cannedResponseId,
    } = this;
    const response = await freshdesk.getCannedResponse({
      $,
      cannedResponseId,
    });
    $.export("$summary", `Successfully retrieved canned response with ID \`${response.id}\``);
    return response;
  },
};
