import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-list-touches",
  name: "List Touches",
  description: "List all touches (campaigns) for a specific group. [See the documentation](https://developer.sendoso.com/rest-api/campaigns/list-touches)",
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
    const response = await this.sendoso.listTouches(this.groupId);
    $.export("$summary", `Successfully retrieved ${response.length} touches`);
    return response;
  },
};
