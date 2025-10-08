import {
  INVOICE_NOTIFICATION_OPTIONS,
  LOCALE_OPTIONS,
  PAYMENT_METHODS_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import xendit from "../../xendit.app.mjs";

export default {
  key: "xendit-create-invoice",
  name: "Create Invoice",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new invoice on Xendit platform [See the documentation](https://developers.xendit.co/api-reference/#create-invoice)",
  type: "action",
  props: {
    xendit,
    externalId: {
      type: "string",
      label: "External ID",
      description: "ID of your choice (typically the unique identifier of an invoice in your system).",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Amount on the invoice. Min and max amounts are stated [here](https://docs.xendit.co/xeninvoice/payment-channels). The amount should be inclusive of any fees and or items that you may choose to include. If there is a difference between this amount and the sum of the price in the `items` parameters and or `fees` parameter, Xendit will refer to this amount parameter to create invoice. Do take note: if the currency or default currency is IDR and the amount includes decimals (e.g IDR 4550.50), the amount will be truncated to IDR 4550.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of invoice - you can use this field to list what items are being paid for, or anything else of your choice that describes the function of the invoice.",
      optional: true,
    },
    givenNames: {
      type: "string",
      label: "Given Names",
      description: "Given name of the customer",
      optional: true,
    },
    surname: {
      type: "string",
      label: "Surname",
      description: "Surname of the customer",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the customer",
      optional: true,
    },
    mobileNumber: {
      type: "string",
      label: "Mobile Number",
      description: "Mobile phone number of the customer in E164 format",
      optional: true,
    },
    addressCity: {
      type: "string",
      label: "City",
      description: "The city of the customer",
      optional: true,
    },
    addressCountry: {
      type: "string",
      label: "Country",
      description: "The country of the customer",
      optional: true,
    },
    addressPostalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the customer",
      optional: true,
    },
    addressstate: {
      type: "string",
      label: "State",
      description: "The state of the customer",
      optional: true,
    },
    addressLine1: {
      type: "string",
      label: "Address Line 1",
      description: "The address line 1 of the customer",
      optional: true,
    },
    addressLine2: {
      type: "string",
      label: "Address Line 2",
      description: "The address line 2 of the customer",
      optional: true,
    },
    invoiceCreatedNotification: {
      type: "string[]",
      label: "Invoice Created Notification",
      description: "Specify which channel you want to notify your end customer through when you create a payment/invoice. If you do not specify values for this object, your end user will not be notified for this notification type.",
      options: INVOICE_NOTIFICATION_OPTIONS,
      optional: true,
    },
    invoiceReminderNotification: {
      type: "string[]",
      label: "Invoice Reminder Notification",
      description: "Specify which channel you want to notify your end customer through when you want to remind your customer to complete their payment. If you do not specify values for this object, your end user will not be notified for this notification type.",
      options: INVOICE_NOTIFICATION_OPTIONS,
      optional: true,
    },
    invoicePaidNotification: {
      type: "string[]",
      label: "Invoice Paid Notification",
      description: "Specify which channel you want to notify your end customer through when they have successfully completed payment. If you do not specify values for this object, your end user will not be notified for this notification type.",
      options: INVOICE_NOTIFICATION_OPTIONS,
      optional: true,
    },
    invoiceDuration: {
      type: "integer",
      label: "Invoice Duration",
      description: "Duration of time that the end customer is given to pay the invoice before expiration (in seconds, since creation). Default is 24 hours (86,400 seconds).",
      optional: true,
    },
    successRedirectUrl: {
      type: "string",
      label: "Success Redirect URL",
      description: "URL to redirect the customer to after successful payment.",
      optional: true,
    },
    failureRedirectUrl: {
      type: "string",
      label: "Failure Redirect URL",
      description: "URL to redirect the customer to after failed payment.",
      optional: true,
    },
    paymentMethods: {
      type: "string[]",
      label: "Payment Methods",
      description: "Specify the payment channels that you wish to be available on your Invoice.",
      options: PAYMENT_METHODS_OPTIONS,
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Currency of the amount that you created.",
      optional: true,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "The default language to display",
      options: LOCALE_OPTIONS,
      optional: true,
    },
    items: {
      type: "string[]",
      label: "Items",
      description: "Array of items JSON objects describing the item(s) purchased. Max array size: 75. Mandatory for PayLater payment method. [See the documentation](https://developers.xendit.co/api-reference/#create-invoice) for further details.",
      optional: true,
    },
    fees: {
      type: "string[]",
      label: "Fees",
      description: "Array of items JSON objects describing the fee(s) that you charge to your end customer. This can be an admin fee, logistics fee, etc. This amount will be included in the total invoice amount and will be transferred to your balance when the transaction settles. Max array size: 10. [See the documentation](https://developers.xendit.co/api-reference/#create-invoice) for further details.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "An object containing any additional information you want to include with the invoice. This will be returned in the response and can be used for tracking or reporting purposes.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.xendit.createInvoice({
      $,
      data: {
        external_id: this.externalId,
        amount: this.amount,
        description: this.description,
        customer: {
          given_names: this.givenNames,
          surname: this.surname,
          email: this.email,
          mobile_number: this.mobileNumber,
          addresses: [
            {
              city: this.addressCity,
              country: this.addressCountry,
              postal_code: this.addressPostalCode,
              state: this.addressstate,
              street_line1: this.addressLine1,
              street_line2: this.addressLine2,
            },
          ],
        },
        customer_notification_preference: {
          invoice_created: parseObject(this.invoiceCreatedNotification),
          invoice_reminder: parseObject(this.invoiceReminderNotification),
          invoice_paid: parseObject(this.invoicePaidNotification),
        },
        invoice_duration: this.invoiceDuration,
        success_redirect_url: this.successRedirectUrl,
        failure_redirect_url: this.failureRedirectUrl,
        payment_methods: parseObject(this.paymentMethods),
        locale: this.locale,
        items: parseObject(this.items),
        fees: parseObject(this.fees),
        currency: this.currency,
        metadata: this.metadata,
      },
    });

    $.export("$summary", `A new invoice with ID: ${response.id} was successfully created!`);
    return response;
  },
};
