import jobber from "../../jobber.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "jobber-create-quote",
  name: "Create Quote",
  description: "Generates a new quote for the client's first property in Jobber",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    jobber,
    clientId: {
      propDefinition: [
        jobber,
        "clientId",
      ],
      required: true,
    },
    quoteDetails: {
      propDefinition: [
        jobber,
        "quoteDetails",
      ],
      required: true,
    },
    servicePrice: {
      propDefinition: [
        jobber,
        "servicePrice",
      ],
      required: true,
    },
    quoteTerms: {
      propDefinition: [
        jobber,
        "quoteTerms",
      ],
      required: true,
    },
  },
  async run({ $ }) {
    const response = await this.jobber.createQuote({
      clientId: this.clientId,
      quoteDetails: this.quoteDetails,
      servicePrice: this.servicePrice,
      quoteTerms: this.quoteTerms,
    });
    $.export("$summary", `Successfully created quote with ID: ${response.id}`);
    return response;
  },
};
