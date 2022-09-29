import ecwid from "../ecwid.app.mjs";

export default {
  name: "Ecwid Get Order",
  version: "0.0.1",
  key: "ecwid-get-order",
  description: "Get Ecwid Order by Order Id. Details of the structure present here - https://api-docs.ecwid.com/reference/get-order",
  props: {
    ecwid,
    orderId: {
      label: "Order ID",
      description: "Order ID for which order details need to be fetched",
      type: "string",
      optional: false,
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    let order = await this.ecwid.getOrder(this.orderId);
    $.export("$summary", `Retrieved Order \`${this.orderId}\``);
    return order;
  },
};
