import { ConfigurationError } from "@pipedream/platform";
import {
  CURRENCY_OPTIONS,
  INVOICE_TYPE_OPTIONS,
  SEND_TYPE_OPTIONS,
  STATUS_OPTIONS,
  TAX_TYPE_OPTIONS,
} from "../../common/constants.mjs";
import sevdesk from "../../sevdesk.app.mjs";

export default {
  key: "sevdesk-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice with optional details like invoice date, due date, discount amount, and invoice items. [See the documentation](https://api.sevdesk.de/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sevdesk,
    invoiceNumber: {
      type: "string",
      label: "Invoice Number",
      description: "The invoice number",
      optional: true,
    },
    contactId: {
      propDefinition: [
        sevdesk,
        "contactId",
      ],
    },
    invoiceDate: {
      type: "string",
      label: "Invoice Date",
      description: "Needs to be provided as timestamp or dd.mm.yyyy",
    },
    header: {
      type: "string",
      label: "Header",
      description: "Normally consist of prefix plus the invoice number.",
      optional: true,
    },
    headText: {
      type: "string",
      label: "Head Text",
      description: "Certain html tags can be used here to format your text.",
      optional: true,
    },
    footText: {
      type: "string",
      label: "Foot Text",
      description: "Certain html tags can be used here to format your text.",
      optional: true,
    },
    timeToPay: {
      type: "integer",
      label: "Time To Pay",
      description: "The time the customer has to pay the invoice in days.",
      optional: true,
    },
    discount: {
      type: "integer",
      label: "Discount",
      description: "If you want to give a discount, define the percentage here. Otherwise provide zero as value.",
      default: 0,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Complete address of the recipient including name, street, city, zip and country. * Line breaks can be used and will be displayed on the invoice pdf.",
      optional: true,
    },
    addressCountryId: {
      propDefinition: [
        sevdesk,
        "addressCountryId",
      ],
    },
    payDate: {
      type: "string",
      label: "Pay Date",
      description: "Needs to be timestamp or `dd.mm.yyyy`.",
      optional: true,
    },
    deliveryDate: {
      type: "string",
      label: "Delivery Date",
      description: "Timestamp. This can also be a date range if you also use `Delivery Date Until`.",
      optional: true,
    },
    deliveryDateUntil: {
      type: "string",
      label: "Delivery Date Until",
      description: "If the delivery date should be a time range, another timestamp can be provided in this attribute * to define a range from timestamp used in deliveryDate attribute to the timestamp used here.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Please have a look in Sevdesk's [Types and status of invoices](https://api.sevdesk.de/#section/Types-and-status-of-invoices) to see what the different status codes mean.",
      options: STATUS_OPTIONS,
    },
    smallSettlement: {
      type: "boolean",
      label: "Small Settlement",
      description: "Defines if the client uses the small settlement scheme. If yes, the invoice must not contain any vat.",
      optional: true,
    },
    taxRate: {
      type: "string",
      label: "Tax Rate",
      description: "Is overwritten by invoice position tax rates.",
    },
    taxText: {
      type: "string",
      label: "Tax Text",
      description: "A common tax text would be 'Tax 19%'.",
    },
    taxType: {
      type: "string",
      label: "Tax Type",
      description: "Tax type of the invoice.",
      options: TAX_TYPE_OPTIONS,
    },
    taxSetId: {
      propDefinition: [
        sevdesk,
        "taxSetId",
      ],
      optional: true,
    },
    paymentMethodId: {
      propDefinition: [
        sevdesk,
        "paymentMethodId",
      ],
      optional: true,
    },
    sendDate: {
      type: "string",
      label: "Send Date",
      description: "The date the invoice was sent to the customer.",
      optional: true,
    },
    invoiceType: {
      type: "string",
      label: "Invoice Type",
      description: "Type of the invoice. For more information on the different types, check [this](https://api.sevdesk.de/#tag/Invoice/Types-and-status-of-invoices) section",
      options: INVOICE_TYPE_OPTIONS,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Currency used in the invoice. Needs to be currency code according to ISO-4217.",
      options: CURRENCY_OPTIONS,
    },
    showNet: {
      type: "boolean",
      label: "Show Net",
      description: "If true, the net amount of each position will be shown on the invoice. Otherwise gross amount.",
      optional: true,
    },
    sendType: {
      type: "string",
      label: "Send Type",
      description: "Type which was used to send the invoice.",
      options: SEND_TYPE_OPTIONS,
      optional: true,
    },
    originId: {
      propDefinition: [
        sevdesk,
        "originId",
      ],
      optional: true,
    },
    customerInternalNote: {
      type: "string",
      label: "Customer Internal Note",
      description: "Internal note of the customer. Contains data entered into field 'Referenz/Bestellnummer'.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      sevdesk,
      contactId,
      addressCountryId,
      taxRate,
      taxSetId,
      paymentMethodId,
      originId,
      ...data
    } = this;

    if (this.taxType && !taxSetId) {
      throw new ConfigurationError("Tax Set needs to be added when you chose the tax type custom!");
    }

    if (paymentMethodId) {
      data.paymentMethod = {
        id: paymentMethodId,
        objectName: "PaymentMethod",
      };
    }
    if (taxSetId) {
      data.taxSet = {
        id: taxSetId,
        objectName: "TaxSet",
      };
    }
    if (originId) {
      data.origin = {
        id: originId,
        objectName: "Origin",
      };
    }

    const { objects } = await sevdesk.checkMe();
    const contactPersonId = objects[0].id;

    const response = await sevdesk.createInvoice({
      $,
      data: {
        objectName: "Invoice",
        contact: {
          id: contactId,
          objectName: "Contact",
        },
        contactPerson: {
          id: contactPersonId,
          objectName: "SevUser",
        },
        addressCountry: {
          id: addressCountryId,
          objectName: "StaticCountry",
        },
        taxRate: parseFloat(taxRate),
        mapAll: true,
        ...data,
      },
    });

    $.export("$summary", `Successfully created invoice with ID ${response.objects.id}`);
    return response;
  },
};
