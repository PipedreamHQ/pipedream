import hex from "../../hex.app.mjs";

export default {
  key: "hex-delete-group",
  name: "Delete Group",
  description: "Delete a group to manage users. [See the documentation](https://learn.hex.tech/docs/api/api-reference#operation/DeleteGroup)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hex,
    groupId: {
      propDefinition: [
        hex,
        "groupId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hex.deleteGroup({
      $,
      groupId: this.groupId,
    });

    $.export("$summary", `Successfully deleted group with ID: ${this.groupId}`);
    return response;
  },
};
