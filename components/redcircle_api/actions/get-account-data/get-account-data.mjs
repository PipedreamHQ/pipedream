import app from "../../redcircle_api.app.mjs";

export default {
  key: "redcircle_api-get-account-data",
  name: "Get Account Data",
  description: "Get your account details. [See the documentation](https://docs.trajectdata.com/redcircleapi/account-api)",
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
    const response = await this.app.getAccountData({
      $,
    });
    $.export("$summary", "Successfully retrieved the account data");
    return response;
  },
};
