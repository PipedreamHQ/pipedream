import aftership from "../../aftership.app.mjs";

export default {
  methods: {
    getData() {
      const data = {
        tracking_number: this.trackingNumber,
        slug: this.slug,
        title: this.title,
        order_id: this.orderId,
        order_id_path: this.orderIdPath,
        order_number: this.orderNumber,
        custom_fields: this.customFields,
        language: this.language,
        smses: this.smses,
        emails: this.emails,
        customer_name: this.customerName,
        order_promised_delivery_date: this.orderPromisedDeliveryDate,
        delivery_type: this.deliveryType,
        pickup_location: this.pickupLocation,
        pickup_note: this.pickupNote,
        tracking_account_number: this.trackingAccountNumber,
        tracking_key: this.trackingKey,
        tracking_ship_date: this.trackingShipDate,
        origin_country_iso3: this.originCountryIso3,
        origin_state: this.originState,
        origin_city: this.originCity,
        origin_postal_code: this.originPostalCode,
        origin_raw_location: this.originRawLocation,
        destination_country_iso3: this.destinationCountryIso3,
        destination_state: this.destinationState,
        destination_city: this.destinationCity,
        destination_postal_code: this.destinationPostalCode,
        destination_raw_location: this.destinationRawLocation,
        note: this.note,
        slug_group: this.slugGroup,
        order_date: this.orderDate,
        shipment_type: this.shipmentType,
        shipment_tags: this.shipmentTags,
      };

      Object.entries(data).forEach(([
        key,
        value,
      ]) => {
        if (value === undefined) {
          delete data[key];
        }
      });

      return data;
    },
  },
  props: {
    slug: {
      propDefinition: [
        aftership,
        "slug",
      ],
      optional: true,
    },
    title: {
      propDefinition: [
        aftership,
        "title",
      ],
      optional: true,
    },
    smses: {
      propDefinition: [
        aftership,
        "smses",
      ],
      optional: true,
    },
    emails: {
      propDefinition: [
        aftership,
        "emails",
      ],
      optional: true,
    },
    customerName: {
      propDefinition: [
        aftership,
        "customerName",
      ],
      optional: true,
    },
    orderId: {
      propDefinition: [
        aftership,
        "orderId",
      ],
      optional: true,
    },
    orderIdPath: {
      propDefinition: [
        aftership,
        "orderIdPath",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        aftership,
        "customFields",
      ],
      optional: true,
    },
    orderNumber: {
      propDefinition: [
        aftership,
        "orderNumber",
      ],
      optional: true,
    },
    language: {
      propDefinition: [
        aftership,
        "language",
      ],
      optional: true,
    },
    orderPromisedDeliveryDate: {
      propDefinition: [
        aftership,
        "orderPromisedDeliveryDate",
      ],
    },
    deliveryType: {
      propDefinition: [
        aftership,
        "deliveryType",
      ],
    },
    pickupLocation: {
      propDefinition: [
        aftership,
        "pickupLocation",
      ],
    },
    pickupNote: {
      propDefinition: [
        aftership,
        "pickupNote",
      ],
    },
    trackingAccountNumber: {
      propDefinition: [
        aftership,
        "trackingAccountNumber",
      ],
    },
    trackingKey: {
      propDefinition: [
        aftership,
        "trackingKey",
      ],
    },
    trackingShipDate: {
      propDefinition: [
        aftership,
        "trackingShipDate",
      ],
    },
    originCountryIso3: {
      propDefinition: [
        aftership,
        "originCountryIso3",
      ],
    },
    originState: {
      propDefinition: [
        aftership,
        "originState",
      ],
    },
    originCity: {
      propDefinition: [
        aftership,
        "originCity",
      ],
    },
    originPostalCode: {
      propDefinition: [
        aftership,
        "originPostalCode",
      ],
    },
    originRawLocation: {
      propDefinition: [
        aftership,
        "originRawLocation",
      ],
    },
    destinationCountryIso3: {
      propDefinition: [
        aftership,
        "destinationCountryIso3",
      ],
    },
    destinationState: {
      propDefinition: [
        aftership,
        "destinationState",
      ],
    },
    destinationCity: {
      propDefinition: [
        aftership,
        "destinationCity",
      ],
    },
    note: {
      propDefinition: [
        aftership,
        "note",
      ],
    },
    orderDate: {
      propDefinition: [
        aftership,
        "orderDate",
      ],
    },
    shipmentType: {
      propDefinition: [
        aftership,
        "shipmentType",
      ],
    },
  },
};
