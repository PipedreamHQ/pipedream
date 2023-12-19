import addevent from "../../addevent.app.mjs";

export default {
  key: "addevent-new-rsvp-attendee",
  name: "New RSVP Attendee",
  description: "Emit new event when a new attendee RSVPs to your event",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    addevent,
    eventId: {
      propDefinition: [
        addevent,
        "eventId",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    _getEventLastUpdatedTime() {
      return this.db.get("eventLastUpdatedTime");
    },
    _setEventLastUpdatedTime(time) {
      this.db.set("eventLastUpdatedTime", time);
    },
  },
  async run() {
    const lastUpdatedTime = this._getEventLastUpdatedTime();
    const { data: event } = await this.addevent._makeRequest({
      method: "GET",
      path: `/events/${this.eventId}`,
    });

    if (event.attendees) {
      const newAttendees = event.attendees.filter(
        (attendee) =>
          new Date(attendee.created).getTime() > new Date(lastUpdatedTime),
      );

      for (const attendee of newAttendees) {
        this.$emit(attendee, {
          id: attendee._id,
          summary: `New RSVP Attendee: ${attendee.name}`,
          ts: Date.parse(attendee.created),
        });
      }
    }

    this._setEventLastUpdatedTime(new Date().toISOString());
  },
};
