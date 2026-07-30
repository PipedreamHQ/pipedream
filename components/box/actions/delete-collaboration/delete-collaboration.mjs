import app from "../../box.app.mjs";

export default {
  key: "box-delete-collaboration",
  name: "Delete Collaboration",
  description: "Removes a collaboration, revoking a user's or group's access to a file or folder. [See the documentation](https://developer.box.com/reference/delete-collaborations-id/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    collaborationId: {
      type: "string",
      label: "Collaboration ID",
      description: "The ID of the collaboration to delete. You can obtain this from the Create Collaboration action response.",
    },
  },
  async run({ $ }) {
    await this.app.deleteCollaboration({
      $,
      collaborationId: this.collaborationId,
    });

    $.export("$summary", `Successfully deleted collaboration ${this.collaborationId}`);
    return {
      success: true,
      collaborationId: this.collaborationId,
    };
  },
};
