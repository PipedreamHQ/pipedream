import app from "../../upsales.app.mjs";

export default {
  key: "upsales-deactivate-user",
  name: "Deactivate User",
  description: "Deactivates a user by ID in Upsales. [See the documentation](https://api.upsales.com/#31878497-b688-4034-9d88-ee99bf152730)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.app.deactivateUser({
      $,
      userId: this.userId,
    });

    $.export("$summary", `Successfully deactivated user: ${response.data?.name || this.userId}`);
    return response;
  },
};
