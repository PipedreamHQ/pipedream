import app from "../../vies_api.app.mjs";

export default {
  key: "vies_api-retrieve-vat-data",
  name: "Retrieve VAT Data",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Get firm data from VIES registry. [See the documentation](https://viesapi.eu/public/rest/index.html#/API/getVIESData)",
  type: "action",
  props: {
    app,
    number: {
      type: "string",
      label: "VAT Number",
      description: "The VAT number to retrieve data.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getVATData({
      $,
      number: this.number,
    });

    $.export("$summary", `The data of the VAT ${this.number} was successfully fetched!`);
    return response;
  },
};
