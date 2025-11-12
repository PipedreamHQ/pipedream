import deepseek from "../../deepseek.app.mjs";

export default {
  key: "deepseek-get-balance",
  name: "Get User Balance",
  description: "Retrieves the user's current balance. [See the documentation](https://api-docs.deepseek.com/api/get-user-balance)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    deepseek,
  },
  async run({ $ }) {
    const response = await this.deepseek.getUserBalance({
      $,
    });
    $.export("$summary", "Successfully retrieved user balance");
    return response;
  },
};
