import zerotier from "../../zerotier.app.mjs";

export default {
  key: "zerotier-get-user",
  type: "action",
  version: "0.0.2",
  name: "Get User",
  description: "Get a specific user. Returns a single user.",
  props: {
    zerotier,
    userId: {
      label: "User",
      description: "Id of the user",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.zerotier.getUser({
      userId: this.userId,
      $,
    });

    $.export("summary", "Sucessfully retrieved user");

    return response;
  },
};
