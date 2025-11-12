import app from "../../bigdatacorp.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "bigdatacorp-get-address-data",
  name: "Get Address Data",
  description: "Returns the available data for a Zipcode number according to the selected dataset. [See the documentation](https://docs.bigdatacorp.com.br/plataforma/reference/enderecos_legal_amazon)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    doc: {
      propDefinition: [
        app,
        "doc",
      ],
      description: "Zipcode of the address you want to search for, i.e.: `88048-656`",
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
        q: `zipcode[${this.doc}]`,
      },
    });

    const status = response.Status[this.dataset][0].Message;

    if (status === "OK") {
      $.export("$summary", `Successfully sent the request for the '${this.dataset}' dataset. Status: ${status}`);
    } else {
      throw new Error(status);
    }

    return response;
  },
};
