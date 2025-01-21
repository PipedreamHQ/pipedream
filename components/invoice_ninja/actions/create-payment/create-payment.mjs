import invoice_ninja from "../../invoice_ninja.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "invoice_ninja-create-payment",
  name: "Create Payment",
  description: "Records a payment for an invoice. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    invoice_ninja,
    paymentId: {
      propDefinition: [
        invoice_ninja,
        "paymentId",
      ],
      optional: true,
    },
    clientId: {
      propDefinition: [
        invoice_ninja,
        "clientId",
      ],
      optional: true,
    },
    clientContactId: {
      propDefinition: [
        invoice_ninja,
        "clientContactId",
      ],
      optional: true,
    },
    userId: {
      propDefinition: [
        invoice_ninja,
        "userId",
      ],
      optional: true,
    },
    typeId: {
      propDefinition: [
        invoice_ninja,
        "typeId",
      ],
      optional: true,
    },
    paymentDate: {
      propDefinition: [
        invoice_ninja,
        "paymentDate",
      ],
      optional: true,
    },
    paymentAmount: {
      propDefinition: [
        invoice_ninja,
        "paymentAmount",
      ],
      optional: true,
    },
    companyGatewayId: {
      propDefinition: [
        invoice_ninja,
        "companyGatewayId",
      ],
      optional: true,
    },
    paymentNumber: {
      propDefinition: [
        invoice_ninja,
        "paymentNumber",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const payment = await this.invoice_ninja.recordPayment({
      id: this.paymentId,
      client_id: this.clientId,
      client_contact_id: this.clientContactId,
      user_id: this.userId,
      type_id: this.typeId,
      date: this.paymentDate,
      amount: this.paymentAmount,
      company_gateway_id: this.companyGatewayId,
      number: this.paymentNumber,
    });
    $.export("$summary", `Payment ${this.paymentNumber || payment.id} created successfully`);
    return payment;
  },
};
