import whiteSwan from "../../white-swan.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "white-swan-submit-complete-plan-request",
  name: "Submit Complete Plan Request",
  description: "Creates a new comprehensive quote request based on the information provided and generates the final quotation without further data requirements.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    whiteSwan,
    extensiveClientData: {
      propDefinition: [
        whiteSwan,
        "extensiveClientData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.whiteSwan.createQuoteRequest({
      data: {
        clientData: this.extensiveClientData,
      },
    });
    $.export("$summary", "Successfully submitted complete plan request");
    return response;
  },
};
