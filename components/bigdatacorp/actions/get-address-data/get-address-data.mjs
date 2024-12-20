import app from "../../bigdatacorp.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "bigdatacorp-get-address-data",
  name: "Get Address Data",
  description: "Returns the available data for a CEP number according to the selected dataset. [See the documentation](https://docs.bigdatacorp.com.br/plataforma/reference/enderecos_legal_amazon)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    zipcode: {
      type: "string",
      label: "Zipcode",
      description: "The postal code to search for",
    },

    dataset: {
      propDefinition: [
        app,
        "dataset",
      ],
      options: constants.ADDRESS_DATASETS,
    },
  },

  async run({ $ }) {
    const response = await this.app.getAddressData({
      $,
      data: {
        Datasets: this.dataset,
        q: `zipcode{${this.zipcode}}`,

      },
    });

    $.export("$summary", `Successfully sent the request for the '${this.dataset}' dataset`);

    return response;
  },
};
