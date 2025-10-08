import mboum from "../../mboum.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "mboum-get-crypto-modules",
  name: "Get Crypto Modules",
  description: "Get crypto modules. [See the documentation](https://docs.mboum.com/#crypto-GETapi-v1-crypto-modules)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mboum,
    module: {
      type: "string",
      label: "Module",
      description: "The module to fetch",
      options: constants.CRYPTO_MODULES,
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getCryptoModules({
      $,
      params: {
        module: this.module,
      },
    });

    $.export("$summary", "Successfully fetched crypto modules");

    return response;
  },
};
