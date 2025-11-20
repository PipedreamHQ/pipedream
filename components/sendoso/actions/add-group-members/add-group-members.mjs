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

    // Parse members: handle string[], single string (JSON), or array
    let membersArray;
    if (Array.isArray(members)) {
      // If it's already an array, check if items are strings that need parsing
      membersArray = members.map((member) => 
        typeof member === "string" ? JSON.parse(member) : member,
      );
    } else if (typeof members === "string") {
      // If it's a single JSON string
      membersArray = JSON.parse(members);
    } else {
      membersArray = members;
    }

    const response = await this.sendoso.addGroupMembers({
      $,
      groupId,
      members: membersArray,
    });

    $.export("$summary", `Successfully added ${membersArray.length} member(s) to group ID: ${groupId}`);
    return response;
  },
};

