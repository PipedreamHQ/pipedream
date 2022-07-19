import verifalia from "../../verifalia.app.mjs";

export default {
  name: "Get Credits Balance",
  description: "Get the number of credit packs and free daily credits available to the account. " +
        "[See the docs](https://verifalia.com/developers#credits-get-balance) for more information",
  key: "verifalia-get-balance",
  version: "1.0.0",
  type: "action",
  props: {
    verifalia,
  },

  async run() {
    const verifaliaClient = this.verifalia.buildVerifaliaRestClient();

    await this.verifalia.wrapVerifaliaApiInvocation(async () => {
      return await verifaliaClient
        .credits
        .getBalance();
    });
  },
};
