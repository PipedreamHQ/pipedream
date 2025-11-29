import app from "../../fortnox.app.mjs";

export default {
  key: "fortnox-list-customers",
  name: "List Customers",
  description: "List all customers in Fortnox. [See the documentation](https://api.fortnox.se/apidocs#tag/fortnox_Customers/operation/list_15)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    filter: {
      type: "string",
      label: "Filter",
      description: "Filter the customers by Active or Inactive",
      options: [
        "active",
        "inactive",
      ],
      optional: true,
    },
    customernumber: {
      type: "string",
      label: "Customer Number",
      description: "Filter by customer number",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Filter by name",
      optional: true,
    },
    zipcode: {
      type: "string",
      label: "Zip Code",
      description: "Filter by zip code",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Filter by city",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Filter by email",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Filter by phone",
      optional: true,
    },
    organisationnumber: {
      type: "string",
      label: "Organisation Number",
      description: "Filter by organisation number",
      optional: true,
    },
    gln: {
      type: "string",
      label: "GLN",
      description: "Filter by GLN",
      optional: true,
    },
    glndelivery: {
      type: "string",
      label: "GLN Delivery",
      description: "Filter by GLN Delivery",
      optional: true,
    },
    lastmodified: {
      type: "string",
      label: "Last Modified",
      description: "Filter by last modified date",
      optional: true,
    },
    sortby: {
      type: "string",
      label: "Sort By",
      description: "Sort the customers by the specified field",
      optional: true,
      options: [
        "customernumber",
        "name",
      ],
    },
  },
  async run({ $ }) {
    const { Customers } = await this.app.listCustomers({
      $,
      params: {
        filter: this.filter,
        customernumber: this.customernumber,
        name: this.name,
        zipcode: this.zipcode,
        city: this.city,
        email: this.email,
        phone: this.phone,
        organisationnumber: this.organisationnumber,
        gln: this.gln,
        glndelivery: this.glndelivery,
        lastmodified: this.lastmodified,
        sortby: this.sortby,
      },
    });

    $.export("$summary", `Successfully retrieved ${Customers.length} customer${Customers.length === 1
      ? ""
      : "s"}`);
    return Customers;
  },
};
