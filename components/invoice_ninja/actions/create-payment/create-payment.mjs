import { parseObject } from "../../common/utils.mjs";
import app from "../../invoice_ninja.app.mjs";

export default {
  key: "invoice_ninja-create-payment",
  name: "Create Payment",
  description: "Records a payment for an invoice. [See the documentation](https://api-docs.invoicing.co/#tag/payments/POST/api/v1/payments)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    clientId: {
      propDefinition: [
        app,
        "clientId",
      ],
      description: "The client hashed id",
    },
    paymentId: {
      type: "string",
      label: "Payment ID",
      description: "The payment hashed id",
      optional: true,
    },
    clientContactId: {
      propDefinition: [
        app,
        "clientContactId",
        ({ clientId }) => ({
          clientId,
        }),
      ],
      optional: true,
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
      description: "The user hashed id",
      optional: true,
    },
    typeId: {
      propDefinition: [
        app,
        "typeId",
      ],
      optional: true,
    },
    paymentDate: {
      type: "string",
      label: "Payment Date",
      description: "Date of the payment (D-M-YYYY)",
      optional: true,
    },
    transactionReference: {
      type: "string",
      label: "Transaction Reference",
      description: "The transaction reference as defined by the payment gateway",
      optional: true,
    },
    assignedUserId: {
      propDefinition: [
        app,
        "userId",
      ],
      description: "The assigned user hashed id",
      optional: true,
    },
    privateNotes: {
      type: "string",
      label: "Private Notes",
      description: "The private notes of the payment",
      optional: true,
    },
    isManual: {
      type: "boolean",
      label: "Is Manual",
      description: "Flags whether the payment was made manually or processed via a gateway",
      optional: true,
    },
    isDeleted: {
      type: "boolean",
      label: "Is Deleted",
      description: "Defines if the payment has been deleted",
      optional: true,
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The amount of this payment",
      optional: true,
    },
    refunded: {
      type: "string",
      label: "Refunded",
      description: "The refunded amount of this payment",
      optional: true,
    },
    companyGatewayId: {
      propDefinition: [
        app,
        "companyGatewayId",
      ],
      optional: true,
    },
    paymentAmount: {
      type: "integer",
      label: "Payment Amount",
      description: "Amount of the payment",
      optional: true,
    },
    paymentables: {
      type: "object",
      label: "Paymentables",
      description: "An object containing the paymentables configuration. **Example: { \"id\": \"AS3df3A\", \"invoice_id\": \"AS3df3A\", \"credit_id\": \"AS3df3A\", \"refunded\": \"10.00\", \"amount\": \"10.00\", \"updated_at\": \"1434342123\", \"created_at\": \"1434342123\" }** [See the documentation](https://api-docs.invoicing.co/#tag/payments/POST/api/v1/payments) for futher details",
      optional: true,
    },
    invoices: {
      type: "string[]",
      label: "Invoices",
      description: "An array of invoice objects. **Example: [{\"invoice_id\": \"AS3df3A\", \"amount\": \"10.00\"}]** [See the documentation](https://api-docs.invoicing.co/#tag/payments/POST/api/v1/payments) for further details",
      optional: true,
    },
    credits: {
      type: "string[]",
      label: "Credits",
      description: "An array of credit objects. **Example: [{\"credit_id\": \"AS3df3A\", \"amount\": \"10.00\"}]** [See the documentation](https://api-docs.invoicing.co/#tag/payments/POST/api/v1/payments) for further details",
      optional: true,
    },
    number: {
      type: "string",
      label: "Number",
      description: "The payment number - is a unique alpha numeric number per payment per company",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.app.recordPayment({
      $,
      data: {
        id: this.paymentId,
        client_id: this.clientId,
        client_contact_id: this.clientContactId,
        user_id: this.userId,
        type_id: this.typeId,
        date: this.paymentDate,
        transaction_reference: this.transactionReference,
        assigned_user_id: this.assignedUserId,
        private_notes: this.privateNotes,
        is_manual: this.isManual,
        is_deleted: this.isDeleted,
        amount: this.amount && parseFloat(this.amount),
        refunded: this.refunded && parseFloat(this.refunded),
        company_gateway_id: this.companyGatewayId,
        paymentables: this.paymentables,
        invoices: parseObject(this.invoices),
        credits: parseObject(this.credits),
        number: this.number,
      },
    });
    $.export("$summary", `Payment ${data.id} created successfully`);
    return data;
  },
};
