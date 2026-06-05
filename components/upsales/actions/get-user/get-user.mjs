import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-user",
  name: "Get User",
  description: "Retrieves a single user by ID from Upsales. [See the documentation](https://api.upsales.com/#07e5839b-2043-4d89-97c3-61be8b8ffe93)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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

    $.export("$summary", `Successfully retrieved user: ${response.data?.name || this.userId}`);
    return response;
  },
};

