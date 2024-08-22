import app from "../../shiphero.app.mjs";
import orderQueries from "../../common/queries/order.mjs";

export default {
  key: "shiphero-get-order",
  name: "Get Order",
  description: "Get an order. [See the documentation](https://developer.shiphero.com/getting-started/)",
  type: "action",
  version: "0.0.1",
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
    getOrder(variables = {}) {
      return this.app.makeRequest({
        query: orderQueries.getOrder,
        variables,
      });
    },
  },
  async run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      getOrder,
      ...variables
    } = this;

    const response = await getOrder(variables);

    step.export("$summary", `Successfully retrieved order with request ID \`${response.order.request_id}\`.`);

    return response;
  },
};
