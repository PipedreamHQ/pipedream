import identitynow from "../../identitynow.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "identitynow-submit-access-request",
  name: "Submit Access Request",
  description: "Sends an access request to IdentityNow. [See the documentation](https://developer.sailpoint.com/docs/api/v2024/create-access-request)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    identitynow,
    requestedFor: {
      propDefinition: [
        identitynow,
        "requestedFor",
      ],
    },
    requestType: {
      propDefinition: [
        identitynow,
        "requestType",
      ],
      optional: true,
    },
    requestedItems: {
      propDefinition: [
        identitynow,
        "requestedItems",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.identitynow.submitAccessRequest();
    $.export("$summary", "Access request submitted successfully.");
    return response;
  },
};
