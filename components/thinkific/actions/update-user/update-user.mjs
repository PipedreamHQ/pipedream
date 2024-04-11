import thinkific from "../../thinkific.app.mjs";

export default {
  key: "thinkific-update-user",
  name: "Update User",
  description: "Updates the information of a specific user on Thinkific",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    thinkific,
    userId: {
      propDefinition: [
        thinkific,
        "userId",
      ],
      description: "The ID of the user to update",
    },
    userInfo: {
      propDefinition: [
        thinkific,
        "userInfo",
      ],
      description: "The updated information of the user",
    },
  },
  async run({ $ }) {
    const response = await this.thinkific.updateUser(this.userId, this.userInfo);
    $.export("$summary", `Successfully updated user ${this.userId}`);
    return response;
  },
};
