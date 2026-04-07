import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-list-monitors",
  name: "List Monitors",
  description: "List all signal monitors. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
    page: { propDefinition: [pubrio, "page"] },
    perPage: { propDefinition: [pubrio, "perPage"] },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Field to order results by",
      optional: true,
    },
    isAscendingOrder: {
      type: "boolean",
      label: "Ascending Order",
      description: "Whether to sort in ascending order",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.page != null) data.page = this.page;
    if (this.perPage != null) data.per_page = this.perPage;
    if (this.orderBy) data.order_by = this.orderBy;
    if (this.isAscendingOrder != null) data.is_ascending_order = this.isAscendingOrder;
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/monitors",
      data,
    });
    $.export("$summary", `Found ${response.data?.length ?? 0} monitors`);
    return response;
  },
};
