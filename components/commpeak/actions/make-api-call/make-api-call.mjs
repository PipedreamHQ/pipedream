import commpeak from "../../commpeak.app.mjs";

export default {
  key: "commpeak-make-api-call",
  name: "Make Custom CommPeak API Call",
  description: "Carries out a custom CommPeak API request, allowing flexibility for virtually any task within CommPeak.",
  version: "0.0.${ts}",
  type: "action",
  props: {
    commpeak,
    apiEndpoint: {
      propDefinition: [
        commpeak,
        "apiEndpoint",
      ],
    },
    apiData: {
      propDefinition: [
        commpeak,
        "apiData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.commpeak.customAPIRequest({
      apiEndpoint: this.apiEndpoint,
      apiData: this.apiData,
    });
    $.export("$summary", `Successfully made custom API call to ${this.apiEndpoint}`);
    return response;
  },
};
