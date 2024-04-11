import thinkific from "../../thinkific.app.mjs";

export default {
  key: "thinkific-create-user",
  name: "Create User",
  description: "Creates a new user on Thinkific. [See the documentation](https://developers.thinkific.com/api/api-documentation/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    thinkific,
    userInfo: {
      propDefinition: [
        thinkific,
        "userInfo",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.thinkific.createUser(this.userInfo);
    $.export("$summary", `Successfully created user with email ${this.userInfo.email}`);
    return response;
  },
};
