import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-list-groups",
  name: "List Groups",
  description: "List all groups (teams). [See the documentation](https://developer.sendoso.com/rest-api/teams/list-groups)",
  version: "0.0.1",
  type: "action",
  props: {
    sendoso,
  },
  async run({ $ }) {
    const response = await this.sendoso.listGroups();
    $.export("$summary", `Successfully retrieved ${response.length} groups`);
    return response;
  },
};
