import hullo from "../../hullo.app.mjs";

export default {
  key: "hullo-add-update-member",
  name: "Add or Update Member",
  description: "Adds a new member or updates an existing member's data in Hullo",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    hullo,
    memberId: {
      propDefinition: [
        hullo,
        "memberId",
      ],
    },
    memberInfo: {
      propDefinition: [
        hullo,
        "memberInfo",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hullo.addOrUpdateMember(this.memberId, this.memberInfo);
    $.export("$summary", `Successfully added or updated member with ID ${this.memberId}`);
    return response;
  },
};
