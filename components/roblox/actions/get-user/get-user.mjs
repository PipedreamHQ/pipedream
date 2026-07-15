import app from "../../roblox.app.mjs";

export default {
  key: "roblox-get-user",
  name: "Get User",
  description: "Get information about a Roblox user by ID. [See the documentation](https://create.roblox.com/docs/cloud/reference/User#Cloud_GetUser)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getUser({
      $,
      userId: this.userId,
    });
    $.export("$summary", `Retrieved user ${response.name} (${response.id})`);
    return response;
  },
};
