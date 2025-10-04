import app from "../../adyen.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "adyen-submit-details",
  name: "Submit Additional Payment Details",
  description: "Submits additional details for a payment. [See the documentation](https://docs.adyen.com/api-explorer/Checkout/71/post/payments/details)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    details: {
      type: "object",
      label: "Details",
      description: "Use this collection to submit the details that were returned as a result of the **Create Payment** action call.",
    },
    authenticationData: {
      type: "string",
      label: "Authentication Data",
      description: "The authentication data that you received from the 3D Secure 2 SDK.",
      optional: true,
    },
    paymentData: {
      type: "string",
      label: "Payment Data",
      description: "The payment data that you received from the **Create Payment** action call. [See the documentation](https://docs.adyen.com/api-explorer/Checkout/71/post/payments/details#request-paymentData).",
      optional: true,
    },
  },
  methods: {
    submitAdditionalDetails({ data } = {}) {
      return this.app.getCheckoutAPI()
        .PaymentsApi
        .paymentsDetails(data);
    },
  },
  async run({ $ }) {
    const {
      submitAdditionalDetails,
      details,
      authenticationData,
      paymentData,
    } = this;

    const response = await submitAdditionalDetails({
      data: {
        details: utils.parse(details),
        authenticationData: utils.parse(authenticationData),
        paymentData,
      },
    });
    $.export("$summary", "Successfully submitted additional payment details.");
    return response;
  },
};
