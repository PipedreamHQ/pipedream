import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "limoexpress",
  propDefinitions: {
    bookingTypeId: {
      type: "string",
      label: "Booking Type ID",
      description: "ID of the booking type.",
      async options() {
        const types = await this.listBookingTypes();
        return types.map((type) => ({
          label: type.name,
          value: type.id,
        }));
      },
    },
    bookingStatusId: {
      type: "string",
      label: "Booking Status ID",
      description: "ID of the booking status.",
      async options() {
        const statuses = await this.listBookingStatuses();
        return statuses.map((status) => ({
          label: status.name,
          value: status.id,
        }));
      },
    },
    bookingId: {
      type: "string",
      label: "Booking ID",
      description: "The ID of the booking.",
    },
    driverId: {
      type: "string",
      label: "Driver ID",
      description: "The ID of the driver to assign to the booking.",
    },
    fromLocation: {
      type: "string",
      label: "From Location",
      description: "The pickup location.",
    },
    pickupTime: {
      type: "string",
      label: "Pickup Time",
      description: "The time scheduled for pickup.",
    },
    cancellationReason: {
      type: "string",
      label: "Cancellation Reason",
      description: "Reason for canceling the booking.",
      optional: true,
    },
    assignmentNotes: {
      type: "string",
      label: "Assignment Notes",
      description: "Additional notes for the driver assignment.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.limoexpress.me/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listBookingTypes(opts = {}) {
      return this._makeRequest({
        path: "/booking_types",
        ...opts,
      });
    },
    async listBookingStatuses(opts = {}) {
      return this._makeRequest({
        path: "/booking_statuses",
        ...opts,
      });
    },
    async createBooking({
      bookingTypeId, fromLocation, pickupTime, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/bookings",
        data: {
          booking_type_id: bookingTypeId,
          from_location: fromLocation,
          pickup_time: pickupTime,
        },
        ...opts,
      });
    },
    async cancelBooking({
      bookingId, cancellationReason, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/bookings/${bookingId}/cancel`,
        data: {
          cancellation_reason: cancellationReason,
        },
        ...opts,
      });
    },
    async assignDriver({
      bookingId, driverId, assignmentNotes, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/bookings/${bookingId}/assign_driver`,
        data: {
          driver_id: driverId,
          assignment_notes: assignmentNotes,
        },
        ...opts,
      });
    },
    async emitNewBookingEvent() {
      // Implementation for emitting new booking event
    },
    async emitCancelledBookingEvent() {
      // Implementation for emitting canceled booking event
    },
    async emitDriverAssignedEvent() {
      // Implementation for emitting driver assigned event
    },
  },
};
