import app from "../../fiserv.app.mjs";

export default {
  key: "fiserv-retrieve-checkout-details",
  name: "Retrieve Checkout Details",
  description: "Retrieve details about a specific checkout using the identifier returned when it was created. [See the documentation](https://docs.fiserv.dev/public/reference/get-checkouts-id).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    checkoutId: {
      type: "string",
      label: "Checkout ID",
      description: "The unique identifier for the checkout.",
      optional: false,
    },
  },
  methods: {
    getCheckoutDetails({
      checkoutId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/checkouts/${checkoutId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getCheckoutDetails,
      checkoutId,
    } = this;

    const response = await getCheckoutDetails({
      $,
      checkoutId,
    });

    $.export("$summary", `Successfully retrieved details for checkout ID ${this.checkoutId}`);
    return response;
  },
};
