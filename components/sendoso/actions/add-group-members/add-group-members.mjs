import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-add-group-members",
  name: "Add Group Members",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add members to a group. [See the documentation](https://sendoso.docs.apiary.io/#reference/group-management)",
  type: "action",
  props: {
    sendoso,
    groupId: {
      propDefinition: [
        sendoso,
        "groupId",
      ],
    },
    members: {
      type: "string[]",
      label: "Members",
      description: "Array of member email addresses or IDs to add to the group.",
    },
  },
  async run({ $ }) {
    const {
      groupId,
      members,
    } = this;

    const response = await this.sendoso.addGroupMembers({
      $,
      groupId,
      members,
    });

    $.export("$summary", `Successfully added ${members.length} member(s) to group ID: ${groupId}`);
    return response;
  },
};

