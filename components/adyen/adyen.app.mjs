import adyen from "@adyen/api-library";

export default {
  type: "app",
  app: "adyen",
  propDefinitions: {
    merchantAccount: {
      type: "string",
      label: "Merchant Account",
      description: "The merchant account identifier, with which you want to process the transaction.",
    },
    amountCurrency: {
      type: "string",
      label: "Currency",
      description: "The currency of the payment amount. The three-character [ISO currency code](https://docs.adyen.com/development-resources/currency-codes).",
    },
    amountValue: {
      type: "integer",
      label: "Value",
      description: "The amount of the transaction, in [minor units](https://docs.adyen.com/development-resources/currency-codes).",
    },
    paymentMethodType: {
      type: "string",
      label: "Payment Method Type",
      description: "The payment method used for the payment. For example `scheme` or `paypal`. For the full list of payment methods, refer to the [documentation](https://docs.adyen.com/api-explorer/Checkout/71/post/payments#request-paymentMethod).",
      async options({ merchantAccount }) {
        if (!merchantAccount) {
          return [];
        }
        const { paymentMethods } = await this.listPaymentMethods({
          data: {
            merchantAccount,
          },
        });
        return paymentMethods.map(({
          name: label, type: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    paymentPspReference: {
      type: "string",
      label: "Payment PSP Reference",
      description: "The PSP reference of the payment for which you want to perform the action.",
    },
  },
  methods: {
    getClient() {
      const {
        api_key: apiKey,
        live_endpoint_url_prefix: liveEndpointUrlPrefix,
        environment,
      } = this.$auth;
      const isLiveEnv = environment === "LIVE";
      return new adyen.Client({
        apiKey,
        environment,
        ...(isLiveEnv && {
          liveEndpointUrlPrefix,
        }),
      });
    },
    getCheckoutAPI() {
      return new adyen.CheckoutAPI(this.getClient());
    },
    listPaymentMethods({
      data, options,
    } = {}) {
      return this.getCheckoutAPI().PaymentsApi.paymentMethods(data, options);
    },
  },
};
