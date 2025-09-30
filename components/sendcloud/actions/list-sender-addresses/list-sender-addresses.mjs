import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-list-sender-addresses",
  name: "List Sender Addresses",
  description: "List sender addresses for the authenticated user. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/branches/v2/sender-addresses/operations/get-a-user-address-sender)",
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
    const response = await this.app.listSenderAddresses({
      $,
    });

    $.export("$summary", "Successfully listed sender addresses");

    return response;
  },
};

