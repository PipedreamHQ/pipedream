import app from "../../lightspeed_retail_pos.app.mjs";

export default {
  key: "lightspeed_retail_pos-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in the Lightspeed Retail POS system. [See the documentation](https://developers.lightspeedhq.com/retail/endpoints/Customer/#post-create-a-customer)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Customer's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Customer's last name",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The job title of the customer",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company name this customer belongs to",
      optional: true,
    },
    companyRegistrationNumber: {
      type: "string",
      label: "Company Registration Number",
      description: "The customer’s company registration number",
      optional: true,
    },
    vatNumber: {
      type: "string",
      label: "VAT Number",
      description: "The customer’s vat number",
      optional: true,
    },
    customerTypeId: {
      propDefinition: [
        app,
        "customerTypeId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { Customer: customer } = await this.app.createCustomer({
      accountId: this.accountId,
      data: {
        firstName: this.firstName,
        lastName: this.lastName,
        title: this.title,
        company: this.company,
        companyRegistrationNumber: this.companyRegistrationNumber,
        vatNumber: this.vatNumber,
        customerTypeID: this.customerTypeId,
      },
      $,
    });

    if (customer) {
      $.export("$summary", `Successfully created customer with ID ${customer.customerID}.`);
    }

    return customer;
  },
};
