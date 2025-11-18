import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-list-group-members",
  name: "List Group Members",
  description: "List all members (users) of a specific group. [See the documentation](https://developer.sendoso.com/rest-api/users/list-group-members)",
  version: "0.0.1",
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
    const response = await this.sendoso.listUsers(this.groupId);
    $.export("$summary", `Successfully retrieved ${response.length} members`);
    return response;
  },
};
