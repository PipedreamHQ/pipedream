import dpd2 from "../../dpd2.app.mjs";

export default {
  key: "dpd2-find-customer",
  name: "Find Customer",
  description: "Find a customer by their email address. [See the documentation](https://docs.getdpd.com/api/reference/operations/listcustomers/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    dpd2,
    email: {
      type: "string",
      label: "Email",
      description: "The customer's email address. Only exact matches are returned.",
    },
  },
  async run({ $ }) {
    const matches = await this.dpd2.listAll({
      $,
      fn: this.dpd2.listCustomers,
      params: {
        email: this.email,
      },
      maxPages: 1,
    });
    const customers = matches.filter(({ email }) => this.dpd2.sameEmail(email, this.email));
    $.export("$summary", customers.length
      ? `Found customer ${customers[0].email}`
      : `No customer with the email ${this.email}`);
    return customers;
  },
};
