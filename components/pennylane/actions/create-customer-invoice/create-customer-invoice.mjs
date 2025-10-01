import { ConfigurationError } from "@pipedream/platform";
import {
  BANKING_PROVIDER_OPTIONS,
  LANGUAGE_OPTIONS,
  PROVIDER_FIELD_NAMES_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import pennylane from "../../pennylane.app.mjs";

export default {
  key: "pennylane-create-customer-invoice",
  name: "Create Customer Invoice",
  description: "Generates a new invoice for a customer using Pennylane. [See the documentation](https://pennylane.readme.io/reference/customer_invoices-post-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pennylane,
    date: {
      type: "string",
      label: "Date",
      description: "Invoice date (ISO 8601)",
    },
    deadline: {
      type: "string",
      label: "Deadline",
      description: "Invoice payment deadline (ISO 8601)",
    },
    externalId: {
      type: "string",
      label: "External Id",
      description: "An id you can use to refer to the invoice from outside of Pennylane",
      optional: true,
    },
    pdfInvoiceFreeText: {
      type: "string",
      label: "PDF Invoice Free Text",
      description: "For example, the contact details of the person to contact",
      optional: true,
    },
    pdfInvoiceSubject: {
      type: "string",
      label: "PDF Invoice Subject",
      description: "Invoice title",
      optional: true,
    },
    draft: {
      type: "boolean",
      label: "Draft",
      description: "Do you wish to create a draft invoice (otherwise it is a finalized invoice)? Reminder, once created, a finalized invoice cannot be edited!",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Invoice Currency (ISO 4217). Default is EUR.",
      optional: true,
    },
    specialMention: {
      type: "string",
      label: "Special Mention",
      description: "Additional details",
      optional: true,
    },
    discount: {
      type: "integer",
      label: "Discount",
      description: "Invoice discount (in percent)",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "invoice pdf language",
      options: LANGUAGE_OPTIONS,
      optional: true,
    },
    bankingProvider: {
      type: "string",
      label: "Banking Provider",
      description: "The banking provider for the transaction",
      options: BANKING_PROVIDER_OPTIONS,
      reloadProps: true,
    },
    providerFieldName: {
      type: "string",
      label: "Provider Field Name",
      description: "Name of the field that you want to match",
      options: PROVIDER_FIELD_NAMES_OPTIONS,
      hidden: true,
    },
    providerFieldValue: {
      type: "string",
      label: "Provider Field Value",
      description: "Value that you want to match",
    },
    customerId: {
      propDefinition: [
        pennylane,
        "customerId",
      ],
    },
    lineItemsSectionsAttributes: {
      propDefinition: [
        pennylane,
        "lineItemsSectionsAttributes",
      ],
      optional: true,
    },
    lineItems: {
      propDefinition: [
        pennylane,
        "lineItems",
      ],
    },
    categories: {
      type: "string[]",
      label: "Categories",
      description: "A list of objects of categories",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date of the imputation period (ISO 8601)",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date of the imputation period (ISO 8601)",
    },
  },
  async additionalProps(props) {
    if (this.bankingProvider === "stripe") {
      props.providerFieldName.hidden = false;
    }
    return {};
  },
  async run({ $ }) {
    try {
      const invoice = await this.pennylane.createInvoice({
        $,
        data: {
          create_customer: false,
          create_products: false,
          invoice: {
            date: this.date,
            deadline: this.deadline,
            external_id: this.externalId,
            pdf_invoice_free_text: this.pdfInvoiceFreeText,
            pdf_invoice_subject: this.pdfInvoiceSubject,
            draft: this.draft,
            currency: this.currency,
            special_mention: this.specialMention,
            discount: this.discount,
            language: this.language,
            transactions_reference: {
              banking_provider: this.bankingProvider,
              provider_field_name: (this.bankingProvider === "gocardless")
                ? "payment_id"
                : this.providerFieldName,
              provider_field_value: this.providerFieldValue,
            },
            customer: {
              source_id: this.customerId,
            },
            line_items_sections_attributes: parseObject(this.lineItemsSectionsAttributes),
            line_items: parseObject(this.lineItems),
            categories: parseObject(this.categories),
            imputation_dates: {
              start_date: this.startDate,
              end_date: this.endDate,
            },
          },
        },
      });

      $.export("$summary", `Created invoice with ID ${invoice.invoice.id}`);
      return invoice;
    } catch ({ response }) {
      throw new ConfigurationError(response?.data?.message || response?.data?.error);
    }
  },
};
