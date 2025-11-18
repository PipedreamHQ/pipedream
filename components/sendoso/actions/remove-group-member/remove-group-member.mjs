import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-remove-group-member",
  name: "Remove Group Member",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Remove a member from a group. [See the documentation](https://sendoso.docs.apiary.io/#reference/group-management)",
  type: "action",
  props: {
    sendoso,
    groupId: {
      propDefinition: [
        sendoso,
        "groupId",
      ],
    },
    memberId: {
      type: "string",
      label: "Member ID",
      description: "ID of the member to remove from the group.",
    },
  },
  async run({ $ }) {
    const {
      groupId,
      memberId,
    } = this;

    const response = await this.sendoso.removeGroupMember({
      $,
      groupId,
      memberId,
    });

    $.export("$summary", `Successfully removed member ID ${memberId} from group ID: ${groupId}`);
    return response;
  },
};

