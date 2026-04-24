import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-list-monitors",
  name: "List Monitors",
  description: "List all signal monitors. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/monitors/monitors)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
    page: {
      propDefinition: [
        pubrio,
        "page",
      ],
    },
    perPage: {
      propDefinition: [
        pubrio,
        "perPage",
      ],
    },
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "Search monitors by name or description",
      optional: true,
    },
    destinationType: {
      type: "string[]",
      label: "Destination Type",
      description: "Filter by destination type",
      options: [
        "webhook",
        "email",
        "sequences",
      ],
      optional: true,
    },
    detectionMode: {
      type: "string[]",
      label: "Detection Mode",
      description: "Filter by detection mode",
      options: [
        {
          label: "Company First",
          value: "company_first",
        },
        {
          label: "Signal First",
          value: "signal_first",
        },
      ],
      optional: true,
    },
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "Filter by active status",
      optional: true,
    },
    isPaused: {
      type: "boolean",
      label: "Is Paused",
      description: "Filter by paused status",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Field to sort results by",
      options: [
        {
          label: "Created At",
          value: "created_at",
        },
        {
          label: "Last Modified",
          value: "last_modified",
        },
        {
          label: "Name",
          value: "name",
        },
      ],
      optional: true,
    },
    isAscendingOrder: {
      type: "boolean",
      label: "Ascending Order",
      description: "Whether to sort in ascending order (default is descending)",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.page != null) data.page = this.page;
    if (this.perPage != null) data.per_page = this.perPage;
    if (this.searchTerm) data.search_term = this.searchTerm;
    if (this.destinationType?.length) data.destination_type = this.destinationType;
    if (this.detectionMode?.length) data.detection_mode = this.detectionMode;
    if (this.isActive != null) data.is_active = this.isActive;
    if (this.isPaused != null) data.is_paused = this.isPaused;
    if (this.orderBy) data.order_by = this.orderBy;
    if (this.isAscendingOrder != null) data.is_ascending_order = this.isAscendingOrder;
    const response = await this.pubrio.listMonitors({
      $,
      data,
    });
    $.export("$summary", `Found ${response.data?.length ?? 0} monitors`);
    return response;
  },
};
