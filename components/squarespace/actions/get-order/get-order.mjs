import squarespace from "../../squarespace.app.mjs";

export default {
  key: "squarespace-get-order",
  name: "Get Order",
  description: "Get a specific order. [See docs here](https://developers.squarespace.com/commerce-apis/retrieve-specific-order)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    squarespace,
    orderId: {
      propDefinition: [
        squarespace,
        "orderId",
      ],
    },
  },
  methods: {},
  async run({ $ }) {
    const response = await this.squarespace.getOrder({
      $,
      orderId: this.orderId,
    });

    $.export("$summary", "Successfully retrieved order.");

    return response;
  },
};
