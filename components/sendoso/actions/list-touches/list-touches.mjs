import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-list-touches",
  name: "List Touches",
  description: "List all touches (campaigns) for a specific group. [See the documentation](https://developer.sendoso.com/rest-api/campaigns/list-touches)",
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
    const response = await this.sendoso.listTouches({
      $,
      groupId: this.groupId,
    });
    
    const count = Array.isArray(response) ?
      response.length :
      (response.data?.length || response.touches?.length || 0);
    $.export("$summary", `Successfully retrieved ${count} touch(es)`);
    return response;
  },
};
