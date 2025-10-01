import cogmento from "../../cogmento.app.mjs";

export default {
  key: "cogmento-create-deal",
  name: "Create Deal",
  description: "Create a new deal in Cogmento CRM. [See the documentation](https://api.cogmento.com/static/swagger/index.html#/Deals/post_deals_)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cogmento,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the deal",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the deal",
      optional: true,
    },
    assigneeIds: {
      propDefinition: [
        cogmento,
        "userIds",
      ],
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Array of tags associated with the deal",
      optional: true,
    },
    closeDate: {
      type: "string",
      label: "Close Date",
      description: "The date the deal was completed (format: YYYY-MM-DD)",
      optional: true,
    },
    productIds: {
      propDefinition: [
        cogmento,
        "productIds",
      ],
      optional: true,
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The final deal value",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.cogmento.createDeal({
      $,
      data: {
        title: this.title,
        description: this.description,
        assigned_to: this.assigneeIds?.map((id) => ({
          id,
        })) || undefined,
        tags: this.tags,
        close_date: this.closeDate,
        products: this.productIds?.map((id) => ({
          id,
        })) || undefined,
        amount: this.amount && +this.amount,
      },
    });
    $.export("$summary", `Successfully created deal: ${this.title}`);
    return response;
  },
};
