import app from "../../oneflow.app.mjs";

export default {
  key: "oneflow-get-contract",
  name: "Get Contract",
  description: "Get one contract, including its state, parties, participants and data fields."
    + " Use **List Contracts** to find the contract."
    + " [See the documentation](https://developer.oneflow.com/reference/get-a-contract-by-id)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    userEmail: {
      propDefinition: [
        app,
        "userEmail",
      ],
    },
    contractId: {
      propDefinition: [
        app,
        "contractId",
        ({ userEmail }) => ({
          userEmail,
        }),
      ],
    },
  },
  async run({ $ }) {
    const contract = await this.app.getContract({
      $,
      userEmail: this.userEmail,
      contractId: this.contractId,
    });
    $.export("$summary", `Retrieved contract ${contract.id}: ${contract.name}`);
    return contract;
  },
};
