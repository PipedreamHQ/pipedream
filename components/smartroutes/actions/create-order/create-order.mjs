import smartroutes from "../../smartroutes.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "smartroutes-create-order",
  name: "Create Order",
  description: "Creates a new order in the smartroutes. [See the documentation](https://api.smartroutes.io/v2/docs/api/#tag/Orders/paths/~1orders/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smartroutes,
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "The order number",
    },
    customerAccount: {
      propDefinition: [
        smartroutes,
        "customerAccount",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the order (delivery, pickup, or shipment).",
      options: [
        "delivery",
        "pickup",
        "shipment",
      ],
    },
    deliveryContactName: {
      type: "string",
      label: "Delivery Contact Name",
      description: "Name of the contact person.",
      optional: true,
    },
    deliveryContactNumber: {
      type: "string",
      label: "Delivery Contact Number",
      description: "Contact number of the person.",
      optional: true,
    },
    deliveryContactEmail: {
      type: "string",
      label: "Delivery Contact Email",
      description: "Email of the contact person.",
      optional: true,
    },
    deliveryAddress: {
      type: "string",
      label: "Delivery Address",
      description: "Delivery address.",
      optional: true,
    },
    deliveryPostcode: {
      type: "string",
      label: "Delivery Postcode",
      description: "Postcode for delivery address.",
      optional: true,
    },
    deliveryLat: {
      type: "string",
      label: "Delivery Latitude",
      description: "Latitude of the delivery location.",
      optional: true,
    },
    deliveryLng: {
      type: "string",
      label: "Delivery Longitude",
      description: "Longitude of the delivery location.",
      optional: true,
    },
    deliveryDuration: {
      type: "integer",
      label: "Delivery Duration",
      description: "Duration for order delivery in minutes.",
      optional: true,
    },
    deliveryNotes: {
      type: "string",
      label: "Delivery Notes",
      description: "Notes for delivery instructions.",
      optional: true,
    },
    deliveryDate: {
      type: "string",
      label: "Delivery Date",
      description: "Date for order delivery.",
      optional: true,
    },
    pickupAddress: {
      type: "string",
      label: "Pickup Address",
      description: "Address for order pickup.",
      optional: true,
    },
    pickupPostcode: {
      type: "string",
      label: "Pickup Postcode",
      description: "Postcode for pickup address.",
      optional: true,
    },
    pickupDuration: {
      type: "integer",
      label: "Pickup Duration",
      description: "Duration for order pickup in minutes.",
      optional: true,
    },
    pickupLat: {
      type: "string",
      label: "Pickup Latitude",
      description: "Latitude of the pickup location.",
      optional: true,
    },
    pickupLng: {
      type: "string",
      label: "Pickup Longitude",
      description: "Longitude of the pickup location.",
      optional: true,
    },
    pickupNotes: {
      type: "string",
      label: "Pickup Notes",
      description: "Notes for pickup instructions.",
      optional: true,
    },
    pickupContactName: {
      type: "string",
      label: "Pickup Contact Name",
      description: "Name of the contact person for pickup.",
      optional: true,
    },
    pickupContactNumber: {
      type: "string",
      label: "Pickup Contact Number",
      description: "Contact number of the person for pickup.",
      optional: true,
    },
    pickupContactEmail: {
      type: "string",
      label: "Pickup Contact Email",
      description: "Email of the contact person for pickup.",
      optional: true,
    },
    parts: {
      type: "integer",
      label: "Parts",
      description: "Number of parts in the order.",
      optional: true,
    },
    lineItems: {
      type: "string[]",
      label: "Line Items",
      description: "Array of line items in the order. Each line item object must contain `product_code`, `product_name`, and `product_quantity`.",
      optional: true,
    },
    timeWindows: {
      type: "string[]",
      label: "Time Windows",
      description: "Array of time windows for order delivery or pickup. Each time window object must contain `from` (Start time of the time window. Ex: \"08:00\") and `to` (End time of the time window. Ex: \"12:00\").",
      optional: true,
    },
    skills: {
      type: "string[]",
      label: "Skills",
      description: "List of required skills for the order. Skills listed must exist within your Vehicle Settings.",
      optional: true,
    },
    customFields: {
      propDefinition: [
        smartroutes,
        "customFields",
      ],
      reloadProps: true,
    },
    capacities: {
      propDefinition: [
        smartroutes,
        "capacities",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.customFields?.length) {
      for (const field of this.customFields) {
        props[`customField_${field}`] = {
          type: "string",
          label: `Value of ${field}`,
        };
      }
    }
    if (this.capacities?.length) {
      for (const capacity of this.capacities) {
        props[`capacity_${capacity}`] = {
          type: "integer",
          label: `Capacity of ${capacity}`,
        };
      }
    }
    return props;
  },
  methods: {
    buildCustomFieldsObj() {
      return this.customFields.map((field) => ({
        name: field,
        value: this[`customField_${field}`],
      }));
    },
    buildCapacitiesObj() {
      return this.capacities.map((capacity) => ({
        type: capacity,
        capacity: this[`capacity_${capacity}`],
      }));
    },
  },
  async run({ $ }) {
    const { orders } = await this.smartroutes.createOrder({
      $,
      data: [
        {
          order_number: this.orderNumber,
          customer: {
            account: this.customerAccount,
          },
          type: this.type,
          delivery_contact_name: this.deliveryContactName,
          delivery_contact_number: this.deliveryContactNumber,
          delivery_contact_email: this.deliveryContactEmail,
          delivery_address: this.deliveryAddress,
          delivery_postcode: this.deliveryPostcode,
          delivery_lat: this.deliveryLat,
          delivery_lng: this.deliveryLng,
          delivery_duration: this.deliveryDuration,
          delivery_notes: this.deliveryNotes,
          delivery_date: this.deliveryDate,
          pickup_address: this.pickupAddress,
          pickup_postcode: this.pickupPostcode,
          pickup_duration: this.pickupDuration,
          pickup_lat: this.pickupLat,
          pickup_lng: this.pickupLng,
          pickup_notes: this.pickupNotes,
          pickup_contact_name: this.pickupContactName,
          pickup_contact_number: this.pickupContactNumber,
          pickup_contact_email: this.pickupContactEmail,
          parts: this.parts,
          line_items: utils.parseObjArray(this.lineItems),
          time_windows: utils.parseObjArray(this.timeWindows),
          skills: this.skills,
          custom_fields: this.customFields?.length && this.buildCustomFieldsObj(),
          capacities: this.capacities?.length && this.buildCapacitiesObj(),
        },
      ],
    });
    $.export("$summary", `Successfully created order with ID: ${orders[0].id}`);
    return orders;
  },
};
