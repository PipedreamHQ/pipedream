import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-delete-group",
  name: "Delete Group",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Delete a group from Sendoso. Note: groups must have no members before they can be deleted. [See the documentation](https://sendoso.docs.apiary.io/#reference/group-management)",
  type: "action",
  props: {
    sendoso,
    groupId: {
      propDefinition: [
        sendoso,
        "groupId",
      ],
    },
  },
  async run({ $ }) {
    const { groupId } = this;

    const response = await this.sendoso.deleteGroup({
      $,
      groupId,
    });

    // Trust HTTP status: if deleteGroup didn't throw, the call succeeded
    $.export("$summary", `Successfully deleted group ID: ${groupId}`);
    return response;
  },
};

