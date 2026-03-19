import constants from "../../common/constants.mjs";
import everstox from "../../everstox.app.mjs";

export default {
  key: "everstox-search-orders",
  name: "Search Orders by Order Number",
  description: "Search orders from Everstox. [See the documentation](https://api.everstox.com/api/v1/ui/#/Order/district_core.api.shops.orders.orders.Orders.index)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    everstox,
    warehouseIds: {
      propDefinition: [
        everstox,
        "warehouseIds",
      ],
      optional: true,
    },
    fields: {
      propDefinition: [
        everstox,
        "fields",
      ],
      type: "string[]",
      label: "Fields",
      description: "Fields to filter for",
      optional: true,
    },
    orderNumber: {
      propDefinition: [
        everstox,
        "orderNumber",
      ],
      description: "Filter for order number",
      optional: true,
    },
    hoursLateLte: {
      type: "integer",
      label: "Hours Late Less Than or Equal to",
      description: "Filter for orders late for the amount of hours less or equal than the provided value",
      optional: true,
    },
    hoursLateGte: {
      type: "integer",
      label: "Hours Late Greater Than or Equal to",
      description: "Filter for orders late for the amount of hours greater or equal than the provided value",
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "Multi-attribute-search filters either for Customer Email or Billing Address or Order Number. Returns set of orders where at least one of those attributes match the search term",
      optional: true,
    },
    fulfillmentState: {
      type: "string",
      label: "Fulfillment State",
      description: "Fulfillment State to filter for order where the corresponding fulfillment is in the given state",
      options: constants.FULFILLMENT_STATE_OPTIONS,
      optional: true,
    },
    fulfillmentStategroup: {
      type: "string",
      label: "Fulfillment Stategroup",
      description: "Fulfillment Stategroup to filter for order where the corresponding fulfillment is in the given stategroup",
      options: constants.FULFILLMENT_STATEGROUP_OPTIONS,
      optional: true,
    },
    stategroup: {
      type: "string",
      label: "Stategroup",
      description: "Stategroup to filter for, e.g. open includes states like new, in_progress etc",
      options: constants.STATEGROUP_OPTIONS,
      optional: true,
    },
    cancellationState: {
      type: "string",
      label: "Cancellation State",
      description: "Cancellation State to filter for order with min 1 cancellation in that state",
      options: constants.CANCELLATION_STATE_OPTIONS,
      optional: true,
    },
    shipmentDateGte: {
      type: "string",
      label: "Shipment Date Greater Than or Equal",
      description: "Find orders whose shipment date is greater than or equal to the provided value",
      optional: true,
    },
    updatedDateGte: {
      type: "string",
      label: "Updated Date Greater Than or Equal",
      description: "Find orders whose updated date is greater than or equal to the provided value",
      optional: true,
    },
    createdDateGte: {
      type: "string",
      label: "Created Date Greater Than or Equal",
      description: "Find orders whose creation date is greater than or equal to the provided value",
      optional: true,
    },
    createdDateLte: {
      type: "string",
      label: "Created Date Less Than or Equal",
      description: "Find orders whose created date is less than or equal to the provided value",
      optional: true,
    },
    shipmentsForwardedToShop: {
      type: "boolean",
      label: "Shipments Forwarded to Shop",
      description: "Boolean returning orders with shipments forwarded to shop",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.everstox.listReturns({
      $,
      params: {
        order_number: this.orderNumber,
        hours_late_lte: this.hoursLateLte,
        hours_late_gte: this.hoursLateGte,
        search: this.search,
        fulfillment_state: this.fulfillmentState,
        fulfillment_stategroup: this.fulfillmentStategroup,
        stategroup: this.stategroup,
        cancellation_state: this.cancellationState,
        shipment_date_gte: this.shipmentDateGte,
        updated_date_gte: this.updatedDateGte,
        created_date_gte: this.createdDateGte,
        created_date_lte: this.createdDateLte,
        shipments_forwarded_to_shop: this.shipmentsForwardedToShop,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.items.length} return${response.items.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
