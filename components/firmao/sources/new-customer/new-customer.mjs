import common from "../common/common.mjs";

export default {
  ...common,
  key: "firmao-new-customer",
  name: "New Customer",
  description:
    "Emit new event when a new customer is created. [See the documentation](https://firmao.net/API-Documentation_EN.pdf)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getSummary(event) {
      return `New Customer - ${event.name}`;
    },
  },
  async run({ $ }) {
    const { data: customers } = await this.app.getCustomers({
      $,
      params: {
        sort: "creationDate",
        dir: "DESC",
      },
    });
    this.processEvents(customers);
  },
};
