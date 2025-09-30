import zohoSalesIQ from "../../zoho_salesiq.app.mjs";

export default {
  key: "zoho_salesiq-get-visitor-feedback",
  name: "Get Visitor Feedback",
  description: "Retrieve visitor feedback by conversation ID. [See the documentation](https://www.zoho.com/salesiq/help/developer-section/get-a-visitor-feedback-v2.html)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zohoSalesIQ,
    screenName: {
      propDefinition: [
        zohoSalesIQ,
        "screenName",
      ],
    },
    conversationId: {
      propDefinition: [
        zohoSalesIQ,
        "conversationId",
        (c) => ({
          screenName: c.screenName,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.zohoSalesIQ.getVisitorFeedback({
      screenName: this.screenName,
      conversationId: this.conversationId,
      $,
    });

    if (data) {
      $.export("$summary", `Successfully retrieved visior feedback for conversation with ID ${this.conversationId}.`);
    } else {
      $.export("$summary", `No feedback found for conversation with ID ${this.conversationId}.`);
    }

    return data;
  },
};
