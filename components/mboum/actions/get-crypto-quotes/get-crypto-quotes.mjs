import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-crypto-quotes",
  name: "Get Crypto Quotes",
  description: "Get crypto quotes. [See the documentation](https://docs.mboum.com/#crypto-GETapi-v1-crypto-quotes)",
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
    const response = await this.mboum.getCryptoQuotes({
      $,
      params: {
        key: this.key,
      },
    });

    $.export("$summary", `Successfully fetched crypto quotes for ${this.key}`);

    return response;
  },
};
