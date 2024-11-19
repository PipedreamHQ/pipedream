import app from "../../fiserv.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "fiserv-create-checkout",
  name: "Create Checkout",
  description: "Initiate a payment request by passing all the required parameters. It creates a new payment transaction and returns the redirect URL that includes transaction ID. [See the documentation](https://docs.fiserv.dev/public/reference/postcheckouts).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    storeId: {
      type: "string",
      label: "Store ID",
      description: "Store id to be used for processing this payment. It also acts as an identifier for your store to load the checkout pages linked to it. If no checkout pages are found, default payment page will be rendered for that transaction.",
    },
    merchantTransactionId: {
      type: "string",
      label: "Merchant Transaction ID",
      description: "You can use this parameter to tag a unique identifier to this transaction for future reference.",
      optional: true,
    },
    transactionOrigin: {
      type: "string",
      label: "Transaction Origin",
      description: "This parameter is used to flag the transaction source correctly. The possible values are `ECOM` (if the order was recieved from online shop), `MAIL` & `PHONE`.",
      options: [
        "ECOM",
        "MAIL",
        "PHONE",
      ],
    },
    transactionType: {
      type: "string",
      label: "Transaction Type",
      description: "You can use this parameter to specify the type of transaction you want to perform. Allowed values are: `SALE`, `PRE-AUTH`, `ZERO-AUTH`",
      options: [
        "SALE",
        "PRE-AUTH",
        "ZERO-AUTH",
      ],
    },
    transactionAmount: {
      type: "object",
      label: "Transaction Amount",
      description: "Object contains `total` transaction amount, `currency`, tax and discount details. Example: `{\"total\":123,\"currency\":\"EUR\",\"components\":{\"subtotal\":115,\"vat\":3,\"shipping\":2.5}}`",
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Object contains order related details. [See the documentation](https://docs.fiserv.dev/public/reference/postcheckouts).",
      optional: true,
    },
    checkoutSettings: {
      type: "string",
      label: "Checkout Settings",
      description: "Object contains checkout related settings. [See the documentation](https://docs.fiserv.dev/public/reference/postcheckouts).",
      default: JSON.stringify({
        locale: "en_US",
      }),
    },
    paymentMethodDetails: {
      type: "string",
      label: "Payment Method Details",
      description: "Object contains payment method related details. [See the documentation](https://docs.fiserv.dev/public/reference/postcheckouts).",
      default: JSON.stringify({
        cards: {
          authenticationPreferences: {
            challengeIndicator: "01",
            skipTra: false,
          },
          createToken: {
            declineDuplicateToken: false,
            reusable: true,
            toBeUsedFor: "UNSCHEDULED",
          },
          tokenBasedTransaction: {
            transactionSequence: "FIRST",
          },
        },
        sepaDirectDebit: {
          transactionSequenceType: "SINGLE",
        },
      }),
    },
  },
  methods: {
    createCheckout(args = {}) {
      return this.app.post({
        path: "/checkouts",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createCheckout,
      storeId,
      merchantTransactionId,
      transactionOrigin,
      transactionType,
      transactionAmount,
      order,
      checkoutSettings,
      paymentMethodDetails,
    } = this;

    const response = await createCheckout({
      $,
      data: {
        storeId,
        merchantTransactionId,
        transactionOrigin,
        transactionType,
        transactionAmount: utils.parseJson(transactionAmount),
        order: utils.parseJson(order),
        checkoutSettings: utils.parseJson(checkoutSettings),
        paymentMethodDetails: utils.parseJson(paymentMethodDetails),
      },
    });

    $.export("$summary", `Successfully created checkout. Redirect URL: ${response.redirectionUrl}`);
    return response;
  },
};
