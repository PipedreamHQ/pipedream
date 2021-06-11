const eventbrite = require("../../eventbrite.app");

module.exports = {
  key: "eventbrite-get-event-attendees",
  name: "Get Event Attendees",
  description: "Get event attendees for a specified event.",
  version: "0.0.1",
  type: "action",
  props: {
    eventbrite,
    eventId: {
      propDefinition: [
        eventbrite,
        "eventId",
      ],
    },
  },
  methods: {
    async *attendeeStream(params = {}) {
      let hasMoreItems;
      do {
        const {
          attendees,
          pagination = {},
        } = await this.eventbrite.getEventAttendees(this.eventId, params);
        for (const attendee of attendees) {
          yield attendee;
        }

        hasMoreItems = !!pagination.has_more_items;
        params.continuation = pagination.continuation;
      } while (hasMoreItems);
    },
  },
  async run() {
    const attendeeStream = await this.attendeeStream();
    const attendees = [];
    for await (const attendee of attendeeStream) {
      attendees.push(attendee);
    }
    return attendees;
  },
};
