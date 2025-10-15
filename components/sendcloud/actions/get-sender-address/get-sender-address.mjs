import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-get-sender-address",
  name: "Get Sender Address",
  description: "Retrieve a sender address by ID. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/branches/v2/sender-addresses/operations/get-a-user-address-sender-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    senderAddressId: {
      propDefinition: [
        app,
        "senderAddress",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      senderAddressId,
    } = this;

    const response = await app.getSenderAddress({
      $,
      senderAddressId,
    });

    $.export("$summary", `Successfully retrieved sender address \`${senderAddressId}\``);

    return response;
  },
};

