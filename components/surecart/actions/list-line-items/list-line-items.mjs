import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-line-items",
  name: "List Line Items",
  description: "Retrieves a paginated list of line items from SureCart. Use to inspect items added to checkouts, audit configurations, or filter by checkout or line item IDs; to find valid checkout IDs, use **List Checkouts**; returns up to 100 items per page and supports pagination parameters. [See the documentation](https://developer.surecart.com/api-reference/line-items/list)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    checkoutIds: {
      propDefinition: [
        surecart,
        "checkoutIds",
      ],
    },
    ids: {
      propDefinition: [
        surecart,
        "ids",
      ],
    },
    maxResults: {
      propDefinition: [
        surecart,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listLineItems,
      args: {
        $,
        params: {
          "checkout_ids[]": this.checkoutIds,
          "ids[]": this.ids,
        },
      },
      max: this.maxResults,
    });

    const lineItems = [];
    for await (const lineItem of results) {
      lineItems.push(lineItem);
    }

    $.export("$summary", `Successfully retrieved ${lineItems.length} line item(s)`);
    return lineItems;
  },
};
