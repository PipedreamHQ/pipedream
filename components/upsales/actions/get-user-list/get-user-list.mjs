import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-user-list",
  name: "Get User List",
  description: "Retrieves a list of users from Upsales. [See the documentation](https://api.upsales.com/#a2a0dc79-a473-4ae4-891d-c31333a221d0)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listUsers({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} user(s)`);
    return response;
  },
};

