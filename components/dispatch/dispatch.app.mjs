import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dispatch",
  propDefinitions: {
    organizationId: {
      type: "integer",
      label: "Organization ID",
      description: "Specify which organization the order should be placed under. Leave empty if not a multi-tier organization.",
      optional: true,
      async options() {
        const organizations = await this.listOrganizations();
        return organizations.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    vehicleType: {
      type: "string",
      label: "Vehicle Type",
      description: "Type or size of vehicle needed.",
      options: [
        "car",
        "midsize",
        "cargo_van",
        "pickup_truck",
        "box_truck",
      ],
      optional: true,
    },
    pickupBusinessName: {
      type: "string",
      label: "Pickup Business Name",
      description: "Name of the pickup business.",
    },
    pickupContactName: {
      type: "string",
      label: "Pickup Contact Name",
      description: "Name of the pickup contact.",
    },
    pickupContactPhoneNumber: {
      type: "string",
      label: "Pickup Contact Phone Number",
      description: "Phone number of the pickup contact. Required format: `123-123-1234`.",
    },
    pickupAddress1: {
      type: "string",
      label: "Pickup Address Line 1",
      description: "Pickup address line 1.",
    },
    pickupAddress2: {
      type: "string",
      label: "Pickup Address Line 2",
      description: "Pickup address line 2.",
      optional: true,
    },
    pickupCity: {
      type: "string",
      label: "Pickup City",
      description: "Pickup city.",
    },
    pickupStateProvinceCode: {
      type: "string",
      label: "Pickup State/Province",
      description: "Pickup state or province code (e.g. `MN`).",
    },
    pickupPostalCode: {
      type: "string",
      label: "Pickup Postal Code",
      description: "Pickup postal code (e.g. `55431`).",
    },
    pickupDateTimeUtc: {
      type: "string",
      label: "Pickup Date/Time (UTC)",
      description: "Desired pickup date/time in ISO 8601 format (e.g. `2019-08-09T13:00:00.000Z`). If not provided, items are assumed ready for immediate pickup.",
      optional: true,
    },
    pickupNotes: {
      type: "string",
      label: "Pickup Notes",
      description: "Notes for the driver about the pickup location.",
      optional: true,
    },
    dropOffBusinessName: {
      type: "string",
      label: "Drop-Off Business Name",
      description: "Name of the drop-off business.",
    },
    dropOffContactName: {
      type: "string",
      label: "Drop-Off Contact Name",
      description: "Name of the drop-off contact.",
    },
    dropOffContactPhoneNumber: {
      type: "string",
      label: "Drop-Off Contact Phone Number",
      description: "Phone number of the drop-off contact. Required format: `123-123-1234`.",
    },
    dropOffAddress1: {
      type: "string",
      label: "Drop-Off Address Line 1",
      description: "Drop-off address line 1.",
    },
    dropOffAddress2: {
      type: "string",
      label: "Drop-Off Address Line 2",
      description: "Drop-off address line 2.",
      optional: true,
    },
    dropOffCity: {
      type: "string",
      label: "Drop-Off City",
      description: "Drop-off city.",
    },
    dropOffStateProvinceCode: {
      type: "string",
      label: "Drop-Off State/Province",
      description: "Drop-off state or province code (e.g. `MN`).",
    },
    dropOffPostalCode: {
      type: "string",
      label: "Drop-Off Postal Code",
      description: "Drop-off postal code (e.g. `55431`).",
    },
    dropOffDateTimeUtc: {
      type: "string",
      label: "Drop-Off Date/Time (UTC)",
      description: "Desired drop-off date/time in ISO 8601 format (e.g. `2019-08-09T16:00:00.000Z`). If not provided, assumes 5pm at the drop-off location's timezone.",
      optional: true,
    },
    dropOffNotes: {
      type: "string",
      label: "Drop-Off Notes",
      description: "Notes for the driver about the drop-off location.",
      optional: true,
    },
    estimatedWeight: {
      type: "integer",
      label: "Estimated Weight (lbs)",
      description: "Estimated weight of the delivery in pounds.",
      optional: true,
    },
    addOns: {
      type: "string[]",
      label: "Add-Ons",
      description: "List of add-on services to include (e.g. `dolly`, `inside_delivery`).",
      optional: true,
    },
    dedicatedVehicle: {
      type: "boolean",
      label: "Dedicated Vehicle",
      description: "Whether the order should use a dedicated vehicle.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      const baseUrl = this.$auth.environment === "production"
        ? "https://api.dispatchit.com"
        : "https://api.demo.dispatchit.com";
      return `${baseUrl}/v1${path}`;
    },
    getHeaders() {
      const {
        api_key: apiKey,
        api_token: apiToken,
      } = this.$auth;
      return {
        "Authorization": `Basic ${Buffer.from(`${apiKey}:${apiToken}`).toString("base64")}`,
        "Accept": "*/*",
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this.getUrl(path),
        headers: this.getHeaders(),
        ...opts,
      });
    },
    listOrganizations(opts = {}) {
      return this._makeRequest({
        path: "/organizations",
        ...opts,
      });
    },
    createEstimate(opts = {}) {
      return this._makeRequest({
        path: "/orders/estimates",
        method: "POST",
        ...opts,
      });
    },
    createOrder(opts = {}) {
      return this._makeRequest({
        path: "/orders",
        method: "POST",
        ...opts,
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        path: "/orders",
        ...opts,
      });
    },
    getOrder({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderId}`,
        ...opts,
      });
    },
  },
};
