import app from "../../codex.app.mjs";

export default {
  key: "codex-get-networks",
  name: "Get Networks",
  description:
    "Returns all 80+ blockchain networks supported by Codex with their numeric IDs and names."
    + " Call this first to resolve `networkId` values required by every other Codex tool."
    + " Example: Ethereum = 1, Polygon = 137, BNB Chain = 56, Arbitrum = 42161."
    + " [See the documentation](https://docs.codex.io/reference/getnetworks)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const QUERY = `
      query GetNetworks {
        getNetworks {
          id
          name
        }
      }
    `;

    const data = await this.app.makeRequest($, QUERY);
    const networks = data.getNetworks;

    $.export("$summary", `Retrieved ${networks.length} supported blockchain networks`);
    return networks;
  },
};
