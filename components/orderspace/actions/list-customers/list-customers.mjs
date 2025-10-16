import orderspace from "../../orderspace.app.mjs";

export default {
  key: "orderspace-list-customers",
  name: "List Customers",
  description: "List a list of customers. [See the documentation](https://apidocs.orderspace.com/#list-customers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    orderspace,
    createdSince: {
      type: "string",
      label: "Created Since",
      description: "Return records created since the given date and time in ISO 8601 format, e.g. 2019-10-29T21:00",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Return customers with the specified company name",
      optional: true,
    },
    buyersEmailAddress: {
      type: "string",
      label: "Buyer's Email Address",
      description: "Return customers with the specified buyers email address",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Return customers with the specified status",
      options: [
        "new",
        "active",
        "closed",
      ],
      optional: true,
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "Return customers with the specified reference",
      optional: true,
    },
    paymentTermId: {
      propDefinition: [
        orderspace,
        "paymentTermId",
      ],
      description: "Return customers with the specified payment terms",
    },
    customerGroupId: {
      propDefinition: [
        orderspace,
        "customerGroupId",
      ],
      description: "Return customers in the specified group",
    },
    priceListId: {
      propDefinition: [
        orderspace,
        "priceListId",
      ],
      description: "Return customers with the specified price list",
    },
    maxResults: {
      propDefinition: [
        orderspace,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const { customers } = await this.orderspace.listCustomers({
      $,
      params: {
        created_since: this.createdSince,
        company_name: this.companyName,
        buyers_email_address: this.buyersEmailAddress,
        status: this.status,
        reference: this.reference,
        payment_terms_id: this.paymentTermId,
        customer_group_id: this.customerGroupId,
        price_list_id: this.priceListId,
        limit: this.maxResults,
      },
    });
    $.export("$summary", `Successfully listed ${customers.length} customers`);
    return customers;
  },
};
