import app from "../../dispatch.app.mjs";

export default {
  key: "dispatch-create-estimate",
  name: "Create Estimate",
  description: "Create a delivery estimate to get pricing and timing options before placing an order. [See the documentation](https://api.dispatchit.com/docs/v1)",
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
    pickupDateTimeUtc: {
      propDefinition: [
        app,
        "pickupDateTimeUtc",
      ],
    },
    dropOffBusinessName: {
      propDefinition: [
        app,
        "dropOffBusinessName",
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
    dropOffDateTimeUtc: {
      propDefinition: [
        app,
        "dropOffDateTimeUtc",
      ],
      description: "Desired drop-off date/time in ISO 8601 format (e.g. `2019-08-09T16:00:00.000Z`).",
    },
    estimatedWeight: {
      propDefinition: [
        app,
        "estimatedWeight",
      ],
    },
    vehicleType: {
      propDefinition: [
        app,
        "vehicleType",
      ],
      description: "Type or size of vehicle needed (`car`, `midsize`, `cargo_van`, `pickup_truck`, `box_truck`).",
    },
    addOns: {
      propDefinition: [
        app,
        "addOns",
      ],
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
  },
  async run({ $ }) {
    const response = await this.app.createEstimate({
      $,
      data: {
        pickup_info: {
          business_name: this.pickupBusinessName,
          location: {
            address: {
              address_1: this.pickupAddress1,
              address_2: this.pickupAddress2,
              city: this.pickupCity,
              state_province_code: this.pickupStateProvinceCode,
              postal_code: this.pickupPostalCode,
            },
          },
          pickup_date_time_utc: this.pickupDateTimeUtc,
        },
        drop_off_info: {
          business_name: this.dropOffBusinessName,
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
          drop_off_date_time_utc: this.dropOffDateTimeUtc,
        },
        vehicle_type: this.vehicleType,
        add_ons: this.addOns,
        dedicated_vehicle: this.dedicatedVehicle,
        organization_id: this.organizationId,
      },
    });
    const count = response?.available_order_options?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} estimate option(s)`);
    return response;
  },
};
