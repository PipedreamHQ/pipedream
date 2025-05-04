import { REQUEST_TYPE_OPTIONS } from "../../common/constants.mjs";
import sailpoint from "../../sailpoint.app.mjs";

export default {
  key: "sailpoint-submit-access-request",
  name: "Submit Access Request",
  description: "Sends an access request to IdentityNow. [See the documentation](https://developer.sailpoint.com/docs/api/v2024/create-access-request)",
  version: "0.0.1",
  type: "action",
  props: {
    sailpoint,
    requestedFor: {
      propDefinition: [
        sailpoint,
        "requestedFor",
      ],
    },
    requestType: {
      type: "string",
      label: "Request Type",
      description: "Type of access request.",
      options: REQUEST_TYPE_OPTIONS,
      default: REQUEST_TYPE_OPTIONS[0].value,
    },
    requestedItems: {
      type: "string[]",
      label: "Requested Items",
      description: "List of requested items as JSON strings. **Example: [{\"type\": \"ROLE\",\"id\": \"2c9180835d2e5168015d32f890ca1581\",\"comment\": \"Requesting access profile for John Doe\",\"clientMetadata\": {\"requestedAppId\":\"2c91808f7892918f0178b78da4a305a1\",\"requestedAppName\":\"test-app\"},\"removeDate\": \"2020-07-11T21:23:15.000Z\"}]**. [See the documentation](https://developer.sailpoint.com/docs/api/v2024/create-access-request) for forther information.",
    },
    clientMetadata: {
      type: "object",
      label: "Client Metadata",
      description: "Arbitrary key-value pairs. They will never be processed by the IdentityNow system but will be returned on associated APIs such as /account-activities. **Example: {\"requestedAppId\":\"2c91808f7892918f0178b78da4a305a1\",\"requestedAppName\":\"test-app\"}**.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sailpoint.submitAccessRequest({
      $,
      data: {
        requestedFor: this.requestedFor,
        requestType: this.requestType,
        resquestItems: this.resquestItems,
        clientMetadata: this.clientMetadata,
      },
    });
    $.export("$summary", "Access request submitted successfully.");
    return response;
  },
};
