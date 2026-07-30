import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-create-refund",
  name: "Create Refund",
  description: "Create a new refund for a charge. [See the documentation](https://developer.surecart.com/api-reference/refunds/create)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    amount: {
      type: "integer",
      label: "Amount",
      description: "Amount to refund in cents. Example: `9900` for $99.00",
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "Reason for the refund.",
      options: [
        "duplicate",
        "fraudulent",
        "requested_by_customer",
        "expired_uncaptured_charge",
      ],
    },
    charge: {
      type: "string",
      label: "Charge ID",
      description: "UUID of the charge to refund. Example: `ch_abc123`",
    },
    returnRequest: {
      type: "string",
      label: "Return Request ID",
      description: "UUID of an associated return request. Use **List Return Requests** to find return request IDs. Example: `rr_abc123`",
      optional: true,
    },
    refundItems: {
      type: "string",
      label: "Refund Items",
      description: "Line items to refund. Each item: `{ \"line_item\": \"li_abc123\", \"quantity\": 1, \"restock\": true, \"revoke_purchase\": false }`",
      optional: true,
    },
    updateReferralCommission: {
      type: "boolean",
      label: "Update Referral Commission",
      description: "Reduce referral commission proportionally based on the refund ratio.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional key-value metadata to attach to the refund. Example: `{ \"order_ref\": \"ORD-001\" }`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.createRefund({
      $,
      params: {
        update_referral_commission: this.updateReferralCommission,
      },
      data: {
        refund: {
          amount: this.amount,
          reason: this.reason,
          charge: this.charge,
          return_request: this.returnRequest,
          refund_items: this.refundItems
            ? JSON.parse(this.refundItems)
            : undefined,
          metadata: this.metadata,
        },
      },
    });
    $.export("$summary", `Successfully created refund ${response.id}`);
    return response;
  },
};
