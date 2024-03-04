import paystack from "../../app/paystack.app.mjs";

export default {
  key: "paystack-list-transaction",
  name: "List Transactions",
  description:
    "List transactions carried out on your integration. [See the documentation](https://paystack.com/docs/api/transaction/#list)",
  version: "0.0.1",
  type: "action",
  props: {
    paystack,
    status: {
        propDefinition: [paystack, "status"],
        optional: true
    },
    customerID: {
        propDefinition: [paystack, "customerID"],
        optional: true
    },
    perPage: {
        propDefinition: [paystack, "perPage"],
        optional: true
    },
    page: {
        propDefinition: [paystack, "page"],
        optional: true
    },
    from: {
        propDefinition: [paystack, "from"],
        optional: true
    },
    to: {
        propDefinition: [paystack, "to"],
        optional: true
    },

  },
  async run({ $ }) {
    const params = {
        status: this.status,
        customerID: this.customerID,
        perPage: this.perPage,
        page: this.page,
        from: this.from,
        to: this.to
    }
    const response = await this.paystack.listTransactions({
      $,
      params
    });

    $.export("$summary", `Transactions retrieved`);
    return response;
  },
};
