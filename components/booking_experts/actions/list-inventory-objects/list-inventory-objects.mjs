import bookingExperts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-list-inventory-objects",
  name: "List Inventory Objects",
  description: "Returns inventory objects of the administration. [See the documentation](https://developers.bookingexperts.com/reference/administration-inventoryobjects-index)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bookingExperts,
    administrationId: {
      propDefinition: [
        bookingExperts,
        "administrationId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Filter by name",
      optional: true,
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "Filter by labels",
      optional: true,
    },
    page: {
      propDefinition: [
        bookingExperts,
        "page",
      ],
    },
    perPage: {
      propDefinition: [
        bookingExperts,
        "perPage",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.bookingExperts.listInventoryObjects({
      $,
      administrationId: this.administrationId,
      params: {
        "filter[name]": this.name,
        "filter[labels]": this.labels
          ? this.labels.join(",")
          : undefined,
        "page[number]": this.page,
        "page[size]": this.perPage,
      },
    });
    $.export("$summary", `Found ${data.length} inventory objects`);
    return data;
  },
};
