import app from "../../printavo.app.mjs";

export default {
  name: "Create Customer",
  description: "Create a new customer. [See the docs here](https://printavo.docs.apiary.io/#reference/customers/customers-collection/customer-create)",
  key: "printavo-create-customer",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
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
    const res = await this.app.createCustomer(data, $);
    $.export("$summary", `Customer successfully created with id ${res.id}`);
    return res;
  },
};
