import orderspace from "../../orderspace.app.mjs";

export default {
  key: "orderspace-create-customer",
  name: "Create Customer",
  description: "Create a new customer. [See the documentation](https://apidocs.orderspace.com/#create-a-customer)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    orderspace,
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the customer's company",
    },
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "The contact name for the customer",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the customer",
    },
    addressLine1: {
      type: "string",
      label: "Address Line 1",
      description: "The first line of the customer's address",
    },
    addressLine2: {
      type: "string",
      label: "Address Line 2",
      description: "The second line of the customer's address",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the customer's address",
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the customer's address",
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the customer's address",
    },
    country: {
      type: "string",
      label: "Country",
      description: "The 2 letter country code of the customer's address",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the customer",
      optional: true,
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "Your reference for the customer",
      optional: true,
    },
    internalNote: {
      type: "string",
      label: "Internal Note",
      description: "An internal note for the customer",
      optional: true,
    },
    taxNumber: {
      type: "string",
      label: "Sales Tax Number",
      description: "The sales tax number of the customer",
      optional: true,
    },
    minimumSpend: {
      type: "string",
      label: "Minimum Spend",
      description: "The minimum spend per order for the customer",
      optional: true,
    },
    paymentTermId: {
      propDefinition: [
        orderspace,
        "paymentTermId",
      ],
    },
    customerGroupId: {
      propDefinition: [
        orderspace,
        "customerGroupId",
      ],
    },
    priceListId: {
      propDefinition: [
        orderspace,
        "priceListId",
      ],
    },
  },
  async run({ $ }) {
    const { customer } = await this.orderspace.createCustomer({
      data: {
        customer: {
          company_name: this.companyName,
          reference: this.reference,
          internal_note: this.internalNote,
          buyers: [
            {
              name: this.contactName,
              email_address: this.email,
            },
          ],
          phone: this.phone,
          email_addresses: {
            orders: this.email,
            dispatches: this.email,
            invoices: this.email,
          },
          tax_number: this.taxNumber,
          addresses: [
            {
              company_name: this.companyName,
              contact_name: this.contactName,
              line1: this.addressLine1,
              line2: this.addressLine2,
              city: this.city,
              state: this.state,
              postal_code: this.postalCode,
              country: this.country,
            },
          ],
          minimum_spend: this.minimumSpend,
          payment_terms_id: this.paymentTermId,
          customer_group_id: this.customerGroupId,
          price_list_id: this.priceListId,
        },
      },
    });
    $.export("$summary", `Successfully created customer with ID: ${customer.id}`);
    return customer;
  },
};
