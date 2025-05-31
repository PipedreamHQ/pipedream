import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-send-estimate",
  name: "Send Estimate",
  description: "Sends an estimate by email. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/estimate#send-an-estimate)",
  version: "0.0.1",
  type: "action",
  props: {
    quickbooks,
    estimateId: {
      propDefinition: [
        quickbooks,
        "estimateId",
      ],
    },
    email: {
      type: "string",
      label: "Email Address",
      description: "Email address to send the estimate to (optional - if not provided, uses the customer's email address)",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    
    if (this.email) {
      data.email = this.email;
    }

    const response = await this.quickbooks.sendEstimate({
      $,
      estimateId: this.estimateId,
      data,
    });

    if (response) {
      $.export("summary", `Successfully sent estimate with ID ${this.estimateId}`);
    }

    return response;
  },
}; 