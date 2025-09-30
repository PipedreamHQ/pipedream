import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-crypto-holders",
  name: "Get Crypto Holders",
  description: "Get crypto holders. [See the documentation](https://docs.mboum.com/#crypto-GETapi-v1-crypto-holders)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mboum,
    key: {
      type: "string",
      label: "Key",
      description: "Provide the crypto ID. Example: `bitcoin`",
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getCryptoHolders({
      $,
      params: {
        key: this.key,
      },
    });

    $.export("$summary", `Successfully fetched crypto holders for ${this.key}`);

    return response.data;
  },
};
