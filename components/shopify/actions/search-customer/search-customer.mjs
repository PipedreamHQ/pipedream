import shopify from "../../shopify.app.js";

export default {
  key: "shopify-search-customer",
  name: "Search Customer",
  description: "Search for a customer or a list of customers",
  version: "0.0.1",
  type: "action",
  props: {
    shopify,
    ids: {
      type: "string[]",
      propDefinition: [
        shopify,
        "customerId",
        (c) => c,
      ],
      label: "Customer IDs",
      description: `Restrict results to customers specified by a comma-separated list of IDs
        Options will display the email registered with the ID
        It is possible to select more than one option`,
      optional: true,
    },
    fields: {
      propDefinition: [
        shopify,
        "responseFields",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to show",
      optional: true,
    },
    sinceId: {
      type: "string",
      label: "Since ID",
      description: "Restrict results to those after the specified ID",
      optional: true,
    },
  },
  async run({ $ }) {
    let params = {
      ids: this.shopify._parseCommaSeparatedStrings(this.ids),
      fields: this.fields,
      limit: this.limit,
      since_id: this.sinceId,
    };

    this.shopify._makeRequestOpts(params);
    let response = await this.shopify.getCustomers(null, null, params);
    $.export("$summary", `Found ${response.length} customer(s)`);
    return response;
  },
};
