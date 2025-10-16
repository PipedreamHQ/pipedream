import eventbrite from "../../eventbrite.app.mjs";

export default {
  key: "eventbrite-get-event-attendees",
  name: "Get Event Attendees",
  description: "Get event attendees for a specified event. [See the documentation](https://www.eventbrite.com/platform/api#/reference/attendee/list/list-attendees-by-event)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    async *attendeeStream($, params = {}) {
      let hasMoreItems;
      do {
        const {
          attendees,
          pagination = {},
        } = await this.eventbrite.getEventAttendees($, this.eventId, params);
        for (const attendee of attendees) {
          yield attendee;
        }

        hasMoreItems = !!pagination.has_more_items;
        params.continuation = pagination.continuation;
      } while (hasMoreItems);
    },
  },
  async run({ $ }) {
    const attendeeStream = await this.attendeeStream($);
    const attendees = [];
    for await (const attendee of attendeeStream) {
      attendees.push(attendee);
    }
    $.export("$summary", `Successfully fetched ${attendees.length} attendees`);
    return attendees;
  },
};
