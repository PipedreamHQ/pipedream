import app from "../../printavo.app.mjs";

export default {
  name: "Update Customer",
  description: "Update a new customer. [See the docs here](https://printavo.docs.apiary.io/#reference/customers/customer/customer-update)",
  key: "printavo-update-customer",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    company: {
      propDefinition: [
        app,
        "company",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
    extraNotes: {
      propDefinition: [
        app,
        "extraNotes",
      ],
    },
    taxExempt: {
      propDefinition: [
        app,
        "taxExempt",
      ],
    },
    taxResaleNum: {
      propDefinition: [
        app,
        "taxResaleNum",
      ],
    },
    salesTax: {
      propDefinition: [
        app,
        "salesTax",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      first_name: this.firstName,
      last_name: this.lastName,
      company: this.company,
      email: this.email,
      phone: this.phone,
      extra_notes: this.extraNotes,
      tax_exempt: this.taxExempt,
      tax_resale_num: this.taxResaleNum,
      sales_tax: this.salesTax,
    };
    const res = await this.app.updateCustomer(this.customerId, data, $);
    $.export("$summary", `Customer successfully updated with id ${res.id}`);
    return res;
  },
};
