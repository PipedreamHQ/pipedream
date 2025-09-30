import app from "../../kaleido.app.mjs";

export default {
  key: "kaleido-delete-contract",
  name: "Delete Contract",
  description: "Delete a contract in Kaleido. [See the documentation](https://api.kaleido.io/platform.html#tag/Contracts/paths/~1consortia~1%7Bconsortia_id%7D~1contracts~1%7Bcontract_id%7D/delete)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    consortiaId: {
      propDefinition: [
        app,
        "consortiaId",
      ],
    },
    contractId: {
      propDefinition: [
        app,
        "contractId",
        (c) => ({
          consortiaId: c.consortiaId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteContract({
      $,
      consortiaId: this.consortiaId,
      contractId: this.contractId,
    });

    $.export("$summary", `Successfully deleted contract with ID '${this.contractId}'`);

    return response;
  },
};
