import app from "../../retriever.app.mjs";

export default {
  key: "retriever-get-order",
  name: "Get Order",
  description: "Fetches a single device return order. [See the documentation](https://app.helloretriever.com/api/v1/docs/#tag/Device-Return-Orders/operation/Get%20Order%20Details)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
  },
  methods: {
    getOrder({
      orderId, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/device_returns/${orderId}/`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      getOrder,
      orderId,
    } = this;
    const response = await getOrder({
      step,
      orderId,
    });

    step.export("$summary", `Successfully retrieved order with ID \`${response.id}\`.`);

    return response;
  },
};
