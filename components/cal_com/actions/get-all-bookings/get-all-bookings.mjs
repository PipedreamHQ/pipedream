import calCom from "../../cal_com.app.mjs";

export default {
  key: "cal_com-get-all-bookings",
  name: "Get All Bookings (v2)",
  description: "Retrieve all bookings from Cal.com using API v2",
  version: "0.0.1",
  type: "action",
  props: {
    calCom,

    status: {
      type: "string[]",
      label: "Status",
      description: "Filter bookings by status",
      optional: true,
      options: [
        "upcoming",
        "recurring",
        "past",
        "cancelled",
        "unconfirmed",
      ],
    },

    afterStart: {
      type: "string",
      label: "After Start",
      description: "Return bookings that start after this time (ISO 8601)",
      optional: true,
    },

    beforeEnd: {
      type: "string",
      label: "Before End",
      description: "Return bookings that end before this time (ISO 8601)",
      optional: true,
    },

    afterCreatedAt: {
      type: "string",
      label: "After Created At",
      description: "Return bookings created after this time (ISO 8601)",
      optional: true,
    },

    beforeCreatedAt: {
      type: "string",
      label: "Before Created At",
      description: "Return bookings created before this time (ISO 8601)",
      optional: true,
    },

    attendeeEmail: {
      type: "string",
      label: "Attendee Email",
      description: "Filter bookings by attendee email",
      optional: true,
    },

    attendeeName: {
      type: "string",
      label: "Attendee Name",
      description: "Filter bookings by attendee name",
      optional: true,
    },

    bookingUid: {
      type: "string",
      label: "Booking UID",
      description: "Filter bookings by booking UID",
      optional: true,
    },

    eventTypeId: {
      type: "integer",
      label: "Event Type ID",
      description: "Filter bookings by event type ID",
      optional: true,
    },

    sortStart: {
      type: "string",
      label: "Sort by Start Time",
      description: "Sort bookings by start time",
      optional: true,
      options: ["asc", "desc"],
    },

    sortEnd: {
      type: "string",
      label: "Sort by End Time",
      description: "Sort bookings by end time",
      optional: true,
      options: ["asc", "desc"],
    },

    sortCreated: {
      type: "string",
      label: "Sort by Created Time",
      description: "Sort bookings by creation time",
      optional: true,
      options: ["asc", "desc"],
    },
  },

  async run({ $ }) {
    const params = {};

    if (this.status?.length) params.status = this.status;
    if (this.afterStart) params.afterStart = this.afterStart;
    if (this.beforeEnd) params.beforeEnd = this.beforeEnd;
    if (this.afterCreatedAt) params.afterCreatedAt = this.afterCreatedAt;
    if (this.beforeCreatedAt) params.beforeCreatedAt = this.beforeCreatedAt;
    if (this.attendeeEmail) params.attendeeEmail = this.attendeeEmail;
    if (this.attendeeName) params.attendeeName = this.attendeeName;
    if (this.bookingUid) params.bookingUid = this.bookingUid;
    if (this.eventTypeId) params.eventTypeId = this.eventTypeId;
    if (this.sortStart) params.sortStart = this.sortStart;
    if (this.sortEnd) params.sortEnd = this.sortEnd;
    if (this.sortCreated) params.sortCreated = this.sortCreated;

    const allBookings = [];
    let skip = 0;
    const take = 100;

    while (true) {
      const response = await this.calCom._makeRequest({
        method: "GET",
        url: `https://${this.calCom.$auth.domain}/v2/bookings`,
        params: {
          ...params,
          take,
          skip,
        },
        headers: {
          "cal-api-version": "2024-08-13",
          Authorization: `Bearer ${this.calCom.$auth.api_key}`,
        },
        $,
      });

      const bookings = response?.data || response || [];
      allBookings.push(...bookings);

      if (bookings.length < take) break;
      skip += take;
    }

    $.export("$summary", `Retrieved ${allBookings.length} bookings`);

    return allBookings;
  },
};
