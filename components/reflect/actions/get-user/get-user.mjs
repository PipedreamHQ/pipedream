import reflect from "../../reflect.app.mjs";

export default {
  key: "reflect-get-user",
  name: "Get User",
  description: "Retieves information about the authenticated user. [See the documentation](https://openpm.ai/apis/reflect#/users/me)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    reflect,
  },
  async run({ $ }) {
    const response = await this.reflect.getUser({
      $,
    });

    if (response) {
      $.export("$summary", "Successfully retrieved user information.");
    }

    return response;
  },
};
