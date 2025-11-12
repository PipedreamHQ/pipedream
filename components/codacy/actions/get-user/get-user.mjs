import app from "../../codacy.app.mjs";

export default {
  key: "codacy-get-user",
  name: "Get Authenticated User",
  description: "Get the authenticated user on Codacy. [See the documentation](https://api.codacy.com/api/api-docs#getuser)",
  version: "0.0.3",
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
    const response = await this.app.getUser({
      $,
    });

    $.export("$summary", "Retrieved authenticated user information");

    return response;
  },
};
