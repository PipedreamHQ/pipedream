import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-get-group",
  name: "Get Group",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve details about a specific group. [See the documentation](https://sendoso.docs.apiary.io/#reference/group-management)",
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

    const response = await this.sendoso.getGroup({
      $,
      groupId,
    });

    $.export("$summary", `Successfully retrieved group ID: ${groupId}`);
    return response;
  },
};

