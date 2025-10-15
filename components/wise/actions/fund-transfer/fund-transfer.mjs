import wise from "../../wise.app.mjs";

export default {
  name: "Fund Transfer",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "wise-fund-transfer",
  description: "Funds a transfer. [See docs here](https://api-docs.transferwise.com/api-reference/transfer#fund)",
  type: "action",
  props: {
    wise,
    profileId: {
      propDefinition: [
        wise,
        "profileId",
      ],
    },
    transferId: {
      propDefinition: [
        wise,
        "transferId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wise.fundTransfer({
      $,
      profileId: this.profileId,
      transferId: this.transferId,
    });

    if (response) {
      $.export("$summary", `Successfully funded a transfer with id ${response.id}`);
    }

    return response;
  },
};
