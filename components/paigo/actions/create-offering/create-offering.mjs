import paigo from "../../paigo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "paigo-create-offering",
  name: "Create Offering",
  description: "Creates a new offering in the Paigo platform. [See the documentation](http://www.api.docs.paigo.tech/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    paigo,
    offeringDetails: {
      propDefinition: [
        paigo,
        "offeringDetails",
      ],
      description: "The details for the new offering, such as title, price, and additional details.",
    },
  },
  async run({ $ }) {
    const response = await this.paigo.createOffering(this.offeringDetails);
    $.export("$summary", `Successfully created offering with ID: ${response.id}`);
    return response;
  },
};
