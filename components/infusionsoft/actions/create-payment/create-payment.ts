import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { CreatePaymentParams } from "../../types/requestParams";

export default defineAction({
  name: "Create Payment",
  description:
    "Create or add a payment record [See docs here](https://developer.infusionsoft.com/docs/rest/#operation/createPaymentOnOrderUsingPOST)",
  key: "infusionsoft-create-payment",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infusionsoft,
    orderId: {
      propDefinition: [
        infusionsoft,
        "orderId",
      ],
    },
    paymentAmount: {
      type: "string",
      label: "Payment Amount",
    },
    paymentMethodType: {
      type: "string",
      label: "Payment Method",
      options: [
        {
          label: "Credit Card",
          value: "CREDIT_CARD",
        },
        {
          label: "Cash",
          value: "CASH",
        },
        {
          label: "Check",
          value: "CHECK",
        },
      ],
    },
    applyToCommissions: {
      type: "boolean",
      label: "Apply to Commissions",
      optional: true,
    },
    chargeNow: {
      type: "boolean",
      label: "Charge Now",
      optional: true,
    },
    creditCardId: {
      type: "integer",
      label: "Credit Card ID",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description:
        "Used when `Charge Now` is **false** or if inserting historical data. Must be a date-time string such as `2017-01-01T22:17:59.039Z`",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      optional: true,
    },
    paymentGatewayId: {
      type: "string",
      label: "Payment Gateway ID",
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    const params: CreatePaymentParams = {
      $,
      orderId: this.orderId,
      data: {
        apply_to_commissions: this.applyToCommissions,
        charge_now: this.chargeNow,
        credit_card_id: this.creditCardId,
        date: this.date,
        notes: this.notes,
        payment_amount: this.paymentAmount,
        payment_gateway_id: this.paymentGatewayId,
        payment_method_type: this.paymentMethodType,
      },
    };
    const data: object = await this.infusionsoft.createPayment(params);

    $.export("$summary", "Created Payment successfully");

    return data;
  },
});
