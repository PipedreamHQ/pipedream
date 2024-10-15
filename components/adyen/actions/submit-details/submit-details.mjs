import app from "../../adyen.app.mjs";

export default {
  key: "adyen-submit-details",
  name: "Submit Additional Payment Details",
  description: "Submits additional details for a payment. [See the documentation](https://docs.adyen.com/api-explorer/checkout/71/post/payments/details)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    details: {
      type: "object",
      label: "Details",
      description: "Use this collection to submit the details that were returned as a result of the **Create Payment** action call.",
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
    } = this;

    const response = await submitAdditionalDetails({
      data: {
        details,
      },
    });
    $.export("$summary", "Successfully submitted additional payment details.");
    return response;
  },
};
