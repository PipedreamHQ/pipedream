import wise from "../../wise.app.mjs";

export default {
  name: "Get Transfer",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "wise-get-transfer",
  description: "Get a transfer. [See docs here](https://api-docs.wise.com/api-reference/transfer#get-by-id)",
  type: "action",
  props: {
    wise,
    transferId: {
      propDefinition: [
        wise,
        "transferId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wise.getTransfer({
      $,
      transferId: this.transferId,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved transfer with id ${response.id}`);
    }

    return response;
  },
};
