import app from "../../navan.app.mjs";

export default {
  key: "navan-get-user",
  name: "Get User",
  description: "Retrieves a specific user by their unique identifier. [See the documentation](https://u.pcloud.link/publink/show?code=XZ7Bww5ZoKb93VNf7ISOdR5UzVo6JzBLs7AX)",
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
    const {
      app, userId,
    } = this;

    const response = await app.getUser({
      $,
      userId,
    });

    $.export("$summary", `Successfully retrieved user with ID \`${response.id}\``);
    return response;
  },
};
