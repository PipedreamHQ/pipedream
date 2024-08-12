import app from "../../remote_retriever.app.mjs";

export default {
  key: "remote_retrieval-get-specificorder",
  name: "Get Specific Order",
  description: "Fetches a single device return order. [See the documentation](https://www.remoteretrieval.com/api-documentation/#order-detail)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    oid: {
      propDefinition: [
        app,
        "oid",
      ],
    },
  },
  methods: {
    getOrder({
      oid, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/device_returns?oid=${oid}/`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      getOrder,
      oid,
    } = this;
    const response = await getOrder({
      step,
      oid,
    });

    step.export("$summary", `Successfully retrieved order with ID \`${response.id}\`.`);

    return response;
  },
};
