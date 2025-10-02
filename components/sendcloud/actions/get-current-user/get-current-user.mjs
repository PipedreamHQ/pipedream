import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-get-current-user",
  name: "Get Current User",
  description: "Get the authenticated user info. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/user/operations/list-user-auth-metadata)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getCurrentUser({
      $,
    });

    $.export("$summary", "Successfully retrieved current user");

    return response;
  },
};

