import { parseObject } from "../../common/utils.mjs";
import app from "../../mamo_business.app.mjs";

export default {
  key: "mamo_business-create-payment-link",
  name: "Create Payment Link",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Generate a vanilla or subscription payment link. [See the documentation](https://mamopay.readme.io/reference/post_links)",
  type: "action",
  props: {
    app,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the payment link.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Payment description. This will appear on the payment checkout page.",
      optional: true,
    },
    capacity: {
      type: "integer",
      label: "Capacity",
      description: "The capacity will be ignored when the subscription params exist and value will be null.",
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Whether the payment is active or not.",
      optional: true,
    },
    returnUrl: {
      type: "string",
      label: "Return URL",
      description: "The URL which the customer will be redirected to after a successful payment.",
      optional: true,
    },
    failureReturnUrl: {
      type: "string",
      label: "Failure Return URL",
      description: "The URL which the customer will be redirected to after a failure payment.",
      optional: true,
    },
    processingFeePercentage: {
      type: "integer",
      label: "Processing Fee Percentage",
      description: "The percentage of the transaction that is the fee.",
      optional: true,
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The value number of the payment.",
      optional: true,
    },
    amountCurrency: {
      type: "string",
      label: "Amount Currency",
      description: "The currency that the transaction will be charged.",
      default: "AED",
      options: [
        "AED",
        "USD",
        "EUR",
        "GBP",
        "SAR",
      ],
    },
    isWidget: {
      type: "boolean",
      label: "Is Widget",
      description: "Generate widget payment link.",
      optional: true,
    },
    enableTabby: {
      type: "boolean",
      label: "Enable Tabby",
      description: "Enables the ability for customers to buy now and pay later.",
      optional: true,
    },
    enableMessage: {
      type: "boolean",
      label: "Enable Message",
      description: "Enables the ability for customers to add a message during the checkout process.",
      optional: true,
    },
    enableTips: {
      type: "boolean",
      label: "Enable Tips",
      description: "Enables the tips option. This will be displayed on the first screen.",
      optional: true,
    },
    enableCustomerDetails: {
      type: "boolean",
      label: "Enable Customer Details",
      description: "Enables adding customer details such as the name, email, and phone number. This screen will be displayed before the payment details screen.",
      optional: true,
    },
    enableQuantity: {
      type: "boolean",
      label: "Enable Quantity",
      description: "Enable the payment link to be used multiple times.",
      optional: true,
    },
    enableQrCode: {
      type: "boolean",
      label: "Enable QR Code",
      description: "Adds the ability to verify a payment through a QR code.",
      optional: true,
    },
    sendCustomerReceipt: {
      type: "boolean",
      label: "Send Customer Receipt",
      description: "Enables the sending of customer receipts.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of customer which will pre-populate in card info step.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of customer which will pre-populate in card info step.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of customer which will pre-populate in card info step.",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External Id",
      description: "The external ID of your choice to associate with payments captured by this payment link.",
      optional: true,
    },
    customData: {
      type: "object",
      label: "Custom Data",
      description: "An object with custom data of the payment link.",
      optional: true,
    },
    isRecurring: {
      type: "boolean",
      label: "Is Recurring",
      description: "Whether this payment link is for a recurring payment.",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.isRecurring) {
      props.frequency = {
        type: "string",
        label: "Frequency",
        description: "Defines the interval that this subscription will be run on.",
        options: [
          "weekly",
          "monthly",
          "annually",
        ],
      };
      props.frequencyInterval = {
        type: "integer",
        label: "Frequency Interval",
        description: "Defines how often this subscription will run. This will be based on the frequency property defined above.",
      };
      props.endDate = {
        type: "string",
        label: "End Date",
        description: "The last date this subscription could run on. Format: YYYY/MM/DD",
      };
      props.paymentQuantity = {
        type: "string",
        label: "Payment Quantity",
        description: "Number of times this subscription will occur. If end_date defined, end_date takes precedence.",
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      app,
      returnUrl,
      failureReturnUrl,
      processingFeePercentage,
      amountCurrency,
      isWidget,
      enableTabby,
      enableMessage,
      enableTips,
      enableCustomerDetails,
      enableQuantity,
      enableQrCode,
      sendCustomerReceipt,
      firstName,
      lastName,
      externalId,
      customData,
      isRecurring,
      frequency,
      frequencyInterval,
      endDate,
      paymentQuantity,
      ...data
    } = this;

    const obj = {
      return_url: returnUrl,
      failure_return_url: failureReturnUrl,
      processing_fee_percentage: processingFeePercentage,
      amount_currency: amountCurrency,
      is_widget: isWidget,
      enable_tabby: enableTabby,
      enable_message: enableMessage,
      enable_tips: enableTips,
      enable_customer_details: enableCustomerDetails,
      enable_quantity: enableQuantity,
      enable_qr_code: enableQrCode,
      send_customer_receipt: sendCustomerReceipt,
      first_name: firstName,
      last_name: lastName,
      external_id: externalId,
      custom_data: customData && parseObject(customData),
      ...data,
    };
    if (isRecurring) {
      obj.subscription = {
        frequency,
        frequency_interval: frequencyInterval,
        end_ate: endDate,
        payment_quantity: paymentQuantity,
      };
    }

    const response = await app.createPaymentLink({
      $,
      data: obj,
    });

    $.export("$summary", `A new payment link with Id: ${response.id} was successfully created!`);
    return response;
  },
};
