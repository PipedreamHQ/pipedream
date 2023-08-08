import stripe from "stripe";
import pick from "lodash.pick";

export default {
  key: "stripe-cancel-payment-intent",
  name: "Cancel a Payment Intent",
  type: "action",
  version: "0.0.2",
  description: "Cancel a [payment intent](https://stripe.com/docs/payments/payment-intents). " +
    "Once canceled, no additional charges will be made by the payment intent and any operations " +
    "on the payment intent will fail with an error. For payment intents with status=" +
    "`requires_capture`, the remaining amount_capturable will automatically be refunded. [See the" +
    " docs](https://stripe.com/docs/api/payment_intents/cancel) for more information",
  props: {
    stripe: {
      type: "app",
      app: "stripe",
    },
    id: {
      type: "string",
      label: "Payment Intent ID",
      description: "Example: `pi_0FhyHzGHO3mdGsgAJNHu7VeJ`",
      options: createOptionsMethod("paymentIntents", [
        "id",
        "description",
      ]),
    },
    cancellation_reason: {
      type: "string",
      label: "Cancellation Reason",
      description: "Indicate why the payment was cancelled",
      options: [
        "duplicate",
        "fraudulent",
        "requested_by_customer",
        "abandoned",
      ],
      optional: true,
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    sdk() {
      return stripe(this._apiKey(), {
        apiVersion: "2020-03-02",
        maxNetworkRetries: 2,
      });
    },
  },
  async run({ $ }) {
    const params = pick(this, [
      "cancellation_reason",
    ]);
    const resp = await this.sdk().paymentIntents.cancel(this.id, params);
    $.export("$summary", "Successfully cancelled payment intent");
    return resp;
  },
};

const createOptionsMethod = (collectionOrFn, keysOrFn) => async function ({
  prevContext, ...opts
}) {
  let { startingAfter } = prevContext;
  let result;
  if (typeof collectionOrFn === "function") {
    result = await collectionOrFn.call(this, {
      prevContext,
      ...opts,
    });
  } else {
    result = await this.sdk()[collectionOrFn].list({
      starting_after: startingAfter,
    });
  }

  let options;
  if (typeof keysOrFn === "function") {
    options = result.data.map(keysOrFn.bind(this));
  } else {
    options = result.data.map((obj) => ({
      value: obj[keysOrFn[0]],
      label: obj[keysOrFn[1]],
    }));
  }

  startingAfter = options?.[options.length - 1]?.value;

  return {
    options,
    context: {
      startingAfter,
    },
  };
};
