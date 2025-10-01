import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-crypto-profile",
  name: "Get Crypto Profile",
  description: "Get crypto profile. [See the documentation](https://docs.mboum.com/#crypto-GETapi-v1-crypto-profile)",
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
    const response = await this.mboum.getCryptoProfile({
      $,
      params: {
        key: this.key,
      },
    });

    $.export("$summary", `Successfully fetched crypto profile for ${this.key}`);

    return response.data;
  },
};
