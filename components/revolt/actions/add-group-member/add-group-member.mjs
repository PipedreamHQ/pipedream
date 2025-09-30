import app from "../../revolt.app.mjs";

export default {
  key: "revolt-add-group-member",
  name: "Add Group Member",
  description: "Adds another user to the group. [See the documentation](https://developers.revolt.chat/developers/api/reference.html#tag/groups/put/channels/{group_id}/recipients/{member_id})",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    target: {
      propDefinition: [
        app,
        "target",
      ],
    },
    member: {
      propDefinition: [
        app,
        "member",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.addGroupMember({
      $,
      target: this.target,
      member: this.member,
    });

    $.export("$summary", `Successfully added the user with ID '${this.member}' to the group with ID '${this.target}'`);

    return response;
  },
};
