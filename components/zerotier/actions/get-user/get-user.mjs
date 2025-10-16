import zerotier from "../../zerotier.app.mjs";

export default {
  key: "zerotier-get-user",
  type: "action",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Get User",
  description: "Get a specific user. Returns a single user. [See docs here](https://docs.zerotier.com/central/v1/#operation/getUserByID)",
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

    $.export("$summary", "Sucessfully retrieved user");

    return response;
  },
};
