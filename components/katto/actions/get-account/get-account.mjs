import katto from "../../katto.app.mjs";

export default {
  key: "katto-get-account",
  name: "Get Account",
  description:
    "Get the account, API key scopes and quota. [See the documentation](https://katto.tech/docs/api)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    katto,
  },
  async run({ $ }) {
    const response = await this.katto.getAccount({
      $,
    });
    $.export("$summary", "Retrieved account details");
    return response;
  },
};
