import teamleaderFocus from "../../teamleader_focus.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "teamleader_focus-update-invoice",
  name: "Update Invoice",
  description: "Update a draft invoice. Booked invoices cannot be updated. [See the documentation](https://developer.teamleader.eu/#/reference/invoicing/invoices/invoices.update)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    teamleaderFocus,
    invoice: {
      propDefinition: [
        teamleaderFocus,
        "invoice",
      ],
    },
    customer: {
      propDefinition: [
        teamleaderFocus,
        "contact",
      ],
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Comments about the invoice",
      optional: true,
    },
    paymentTermType: {
      type: "string",
      label: "Payment Term Type",
      description: "Type of payment term for the invoice",
      options: constants.PAYMENT_TERM_TYPES,
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.paymentTermType) {
      const { data: terms } = await this.teamleaderFocus.listPaymentTerms();
      const termDayOptions = terms.filter(({ type }) => type === this.paymentTermType).map(({ days }) => `${days}`);
      props.paymentTermDays = {
        type: "string",
        label: "Payment Term Days",
        description: "Number of days to apply to the payment term",
        options: termDayOptions,
        optional: this.paymentTermType === "cash"
          ? true
          : false,
      };
    }
    return props;
  },
  async run({ $ }) {
    const data = {
      id: this.invoice,
      note: this.note,
    };
    if (this.customer) {
      data.invoicee = {
        customer: {
          type: "contact",
          id: this.customer,
        },
      };
    }
    if (this.paymentTermType) {
      data.payment_term = {
        type: this.paymentTermType,
        days: this.paymentTermDays,
      };
    }

    const response = await this.teamleaderFocus.updateInvoice({
      data,
      $,
    });

    $.export("$summary", `Successfully updated invoice with ID ${this.invoice}`);

    return response;
  },
};
