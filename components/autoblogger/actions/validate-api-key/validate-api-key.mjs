import app from "../../autoblogger.app.mjs";

export default {
  key: "autoblogger-validate-api-key",
  name: "Validate API Key",
  description: "Validates the provided API key. [See the documentation](https://u.pcloud.link/publink/show?code=XZdjuv0ZtabS8BN58thUiE8FGjznajoMc6Qy)",
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
    const response = await this.app.validateKey({
      $,
    });

    $.export("$summary", `API Key ${response.is_valid
      ? "is"
      : "isn't"} valid`);

    return response;
  },
};
