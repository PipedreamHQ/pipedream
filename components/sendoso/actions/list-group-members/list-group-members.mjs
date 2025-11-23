import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-list-group-members",
  name: "List Group Members",
  description: "List all members (users) of a specific group. [See the documentation](https://developer.sendoso.com/rest-api/users/list-group-members)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    const response = await this.sendoso.listGroupMembers({
      $,
      groupId: this.groupId,
    });

    const count = Array.isArray(response) ?
      response.length :
      (response.data?.length || response.users?.length || 0);
    $.export("$summary", `Successfully retrieved ${count} member(s)`);
    return response;
  },
};
