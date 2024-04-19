import smartroutes from "../../smartroutes.app.mjs";

export default {
  key: "smartroutes-create-order",
  name: "Create Order",
  description: "Creates a new order in the smartroutes. [See the documentation](https://api.smartroutes.io/v2/docs/api/#tag/Orders/paths/~1orders/post)",
  version: "0.0.1",
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
        },
      ],
    });
    $.export("$summary", `Successfully created order with ID: ${orders[0].id}`);
    return orders;
  },
};
