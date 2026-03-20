import app from "../../dispatch.app.mjs";

export default {
  key: "dispatch-create-order",
  name: "Create Order",
  description: "Create a new delivery order. [See the documentation](https://api.dispatchit.com/docs/v1)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    pickupBusinessName: {
      propDefinition: [
        app,
        "pickupBusinessName",
      ],
    },
    pickupContactName: {
      propDefinition: [
        app,
        "pickupContactName",
      ],
    },
    pickupContactPhoneNumber: {
      propDefinition: [
        app,
        "pickupContactPhoneNumber",
      ],
    },
    pickupAddress1: {
      propDefinition: [
        app,
        "pickupAddress1",
      ],
    },
    pickupAddress2: {
      propDefinition: [
        app,
        "pickupAddress2",
      ],
    },
    pickupCity: {
      propDefinition: [
        app,
        "pickupCity",
      ],
    },
    pickupStateProvinceCode: {
      propDefinition: [
        app,
        "pickupStateProvinceCode",
      ],
    },
    pickupPostalCode: {
      propDefinition: [
        app,
        "pickupPostalCode",
      ],
    },
    pickupNotes: {
      propDefinition: [
        app,
        "pickupNotes",
      ],
    },
    // drop_off_info
    dropOffBusinessName: {
      propDefinition: [
        app,
        "dropOffBusinessName",
      ],
    },
    dropOffContactName: {
      propDefinition: [
        app,
        "dropOffContactName",
      ],
    },
    dropOffContactPhoneNumber: {
      propDefinition: [
        app,
        "dropOffContactPhoneNumber",
      ],
    },
    dropOffAddress1: {
      propDefinition: [
        app,
        "dropOffAddress1",
      ],
    },
    dropOffAddress2: {
      propDefinition: [
        app,
        "dropOffAddress2",
      ],
    },
    dropOffCity: {
      propDefinition: [
        app,
        "dropOffCity",
      ],
    },
    dropOffStateProvinceCode: {
      propDefinition: [
        app,
        "dropOffStateProvinceCode",
      ],
    },
    dropOffPostalCode: {
      propDefinition: [
        app,
        "dropOffPostalCode",
      ],
    },
    dropOffNotes: {
      propDefinition: [
        app,
        "dropOffNotes",
      ],
    },
    estimatedWeight: {
      propDefinition: [
        app,
        "estimatedWeight",
      ],
    },
    // delivery_info
    quantityOfPackages: {
      type: "integer",
      label: "Quantity of Packages",
      description: "Number of packages/items in the order.",
    },
    vehicleType: {
      propDefinition: [
        app,
        "vehicleType",
      ],
      description: "Type or size of vehicle needed. If left blank, cargo van will be selected.",
    },
    serviceType: {
      type: "string",
      label: "Service Type",
      description: "Level of service. If left blank, the best option based on times will be selected.",
      options: [
        "asap",
        "expedited",
        "standard",
        "same_day",
      ],
      optional: true,
    },
    pickupDateTimeUtc: {
      propDefinition: [
        app,
        "pickupDateTimeUtc",
      ],
    },
    dropOffDateTimeUtc: {
      propDefinition: [
        app,
        "dropOffDateTimeUtc",
      ],
    },
    referenceNumber: {
      type: "string",
      label: "Reference Number",
      description: "External reference or PO number.",
      optional: true,
    },
    billingNotes: {
      type: "string",
      label: "Billing Notes",
      description: "Billing notes for this order. Not visible to the driver.",
      optional: true,
    },
    trackingEmailAddresses: {
      type: "string",
      label: "Tracking Email Addresses",
      description: "Email addresses the tracking link will be sent to. May be comma and/or space separated (e.g. `aaa@example.com, bbb@example.com`).",
      optional: true,
    },
    trackingPhoneNumbers: {
      type: "string",
      label: "Tracking Phone Numbers",
      description: "Phone numbers that tracking SMS messages will be sent to. May be comma and/or space separated (e.g. `555-111-2222, 555-222-3333`).",
      optional: true,
    },
    needsUnloadingAssistance: {
      type: "boolean",
      label: "Needs Unloading Assistance",
      description: "Indicates if the order requires assistance unloading.",
      optional: true,
    },
    dedicatedVehicle: {
      propDefinition: [
        app,
        "dedicatedVehicle",
      ],
    },
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    addOns: {
      propDefinition: [
        app,
        "addOns",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createOrder({
      $,
      data: {
        delivery_info: {
          reference_number: this.referenceNumber,
          organization_id: this.organizationId,
          billing_notes: this.billingNotes,
          vehicle_type: this.vehicleType,
          quantity_of_packages: this.quantityOfPackages,
          service_type: this.serviceType,
          needs_unloading_assistance: this.needsUnloadingAssistance,
          pickup_date_time_utc: this.pickupDateTimeUtc,
          drop_off_date_time_utc: this.dropOffDateTimeUtc,
          tracking_email_addresses: this.trackingEmailAddresses,
          tracking_phone_numbers: this.trackingPhoneNumbers,
          dedicated_vehicle: this.dedicatedVehicle,
        },
        pickup_info: {
          business_name: this.pickupBusinessName,
          contact_name: this.pickupContactName,
          contact_phone_number: this.pickupContactPhoneNumber,
          location: {
            address: {
              address_1: this.pickupAddress1,
              address_2: this.pickupAddress2,
              city: this.pickupCity,
              state_province_code: this.pickupStateProvinceCode,
              postal_code: this.pickupPostalCode,
            },
          },
          pickup_notes: this.pickupNotes,
        },
        drop_off_info: {
          business_name: this.dropOffBusinessName,
          contact_name: this.dropOffContactName,
          contact_phone_number: this.dropOffContactPhoneNumber,
          estimated_weight: this.estimatedWeight,
          location: {
            address: {
              address_1: this.dropOffAddress1,
              address_2: this.dropOffAddress2,
              city: this.dropOffCity,
              state_province_code: this.dropOffStateProvinceCode,
              postal_code: this.dropOffPostalCode,
            },
          },
          drop_off_notes: this.dropOffNotes,
        },
        add_ons: this.addOns,
      },
    });
    $.export("$summary", `Successfully created order with ID: ${response?.order_id}`);
    return response;
  },
};
