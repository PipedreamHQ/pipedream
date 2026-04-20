import app from "../../d2l_brightspace.app.mjs";

export default {
  key: "d2l_brightspace-get-user",
  name: "Get User",
  description: "Retrieves information about a specific user from D2L Brightspace. [See the documentation](https://docs.valence.desire2learn.com/res/user.html)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
  },
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
    idempotentHint: true,
  },
  async run({ $ }) {
    const response = await this.app.getUser({
      userId: this.userId,
      $,
    });

    $.export("$summary", `Successfully retrieved user ${response.FirstName} ${response.LastName}`);
    return response;
  },
};
