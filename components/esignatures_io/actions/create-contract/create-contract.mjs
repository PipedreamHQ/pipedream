import esignatures_io from "../../esignatures_io.app.mjs";

export default {
  version: "0.0.1",
  key: "esignatures_io-create-contract",
  name: "Create Contract",
  description: "Creates a contract and sends the links (via email or SMS) to the signers to collect their signatures. [See docs here](https://esignatures.io/docs/api#contracts)",
  type: "action",
  props: {
    esignatures_io,
  },
  async run({ $ }) {
    const response = await this.esignatures_io.createContract({
      $,
      data: {},
    });

    if (response) {
      this.export("$summary", `Successfully created contract with id ${response.id}`);
    }

    return response;
  },
};
