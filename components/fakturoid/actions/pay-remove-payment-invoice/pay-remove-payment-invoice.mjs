import constants from "../../common/constants.mjs";
import fakturoid from "../../fakturoid.app.mjs";

export default {
  key: "fakturoid-pay-remove-payment-invoice",
  name: "Pay or Remove Payment for Invoice",
  description: "Executes payment for an invoice or removes an already applied payment. [See the documentation](https://www.fakturoid.cz/api/v3/invoice-payments)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fakturoid,
    accountSlug: {
      propDefinition: [
        fakturoid,
        "accountSlug",
      ],
    },
    invoiceId: {
      propDefinition: [
        fakturoid,
        "invoiceId",
        ({ accountSlug }) => ({
          accountSlug,
        }),
      ],
    },
    actionType: {
      type: "string",
      label: "Action Type",
      description: "Specify if you want to execute or remove a payment",
      options: constants.ACTION_TYPE_OPTIONS,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.actionType === "execute") {
      props.paidOn = {
        type: "string",
        label: "Paid On",
        description: "Payment date. **Format: YYYY-MM-DD** Default: Today",
        optional: true,
      };
      props.currency = {
        type: "string",
        label: "Currency",
        description: "Currency [ISO Code](https://en.wikipedia.org/wiki/ISO_4217#List_of_ISO_4217_currency_codes) (same as invoice currency)",
        optional: true,
      };
      props.amount = {
        type: "string",
        label: "Amount",
        description: "Paid amount in document currency. Default: Remaining amount to pay",
        optional: true,
      };
      props.markDocumentAsPaid = {
        type: "boolean",
        label: "Mark Document As Paid",
        description: "Mark document as paid? Default: true if the total paid amount becomes greater or equal to remaining amount to pay",
        optional: true,
      };
    } else if (this.actionType === "remove") {
      props.paymentId =  {
        type: "string",
        label: "Payment ID",
        description: "ID of the payment to be removed.",
        options: async () => {
          const { payments } = await this.fakturoid.getInvoice({
            accountSlug: this.accountSlug,
            invoiceId: this.invoiceId,
          });

          return payments.map(({
            id: value, paid_on: pOn, currency, amount,
          }) => ({
            label: `${currency} ${amount} (${pOn})`,
            value,
          }));
        },
      };
    }
    return props;
  },
  async run({ $ }) {
    if (this.actionType === "execute") {
      const response = await this.fakturoid.payInvoice({
        accountSlug: this.accountSlug,
        invoiceId: this.invoiceId,
        data: {
          paid_on: this.paidOn,
          currency: this.currency,
          amount: this.amount && parseFloat(this.amount),
          mark_document_as_paid: this.markDocumentAsPaid,
        },
      });
      $.export("$summary", `Successfully executed payment for invoice ID ${this.invoiceId}`);
      return response;
    } else if (this.actionType === "remove") {
      const response = await this.fakturoid.removePayment({
        $,
        accountSlug: this.accountSlug,
        invoiceId: this.invoiceId,
        paymentId: this.paymentId,
      });
      $.export("$summary", `Successfully removed payment ID ${this.paymentId} from invoice ID ${this.invoiceId}`);
      return response;
    }
  },
};
