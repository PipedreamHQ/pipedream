import ecwid from "../../ecwid.app.mjs";

export default {
  name: "Get Order",
  version: "0.0.1",
  key: "get-order",
  description: "",
  props: {
    orderId: {
      label: "Order ID",
      description: "Order ID for which fulfilment status need to be updated",
      type: "string",
      optional: false,
    },
    ecwid,
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    let order = await this.ecwid.getOrder(this.orderId);
    $.export("$summary", `Retrieved Order \`${this.orderId}\``);
    return order;
  },
};
