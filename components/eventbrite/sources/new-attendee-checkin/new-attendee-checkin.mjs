import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "eventbrite-new-attendee-checkin",
  name: "New Attendee Check-In (Instant)",
  description: "Emit new event when an attendee checks in to an event",
  version: "0.0.6",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    event: {
      propDefinition: [
        common.props.eventbrite,
        "event",
        (c) => ({
          organization: c.organization,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getActions() {
      return "attendee.checked_in";
    },
    async getData(attendee) {
      const { event_id: eventId } = attendee;
      const event = await this.eventbrite.getEvent(null, eventId);
      return {
        attendee,
        event,
      };
    },
    generateMeta({ attendee }) {
      const {
        id, profile, created,
      } = attendee;
      return {
        id,
        summary: profile.name,
        ts: Date.parse(created),
      };
    },
  },
  async run(event) {
    const url = event?.body?.api_url;
    if (!url) return;

    const resource = await this.eventbrite.getResource(url);

    if (this.event && resource.event_id !== this.event) {
      console.log(`Skipping attendee check-in for event ${resource.event_id} (filtering for event ${this.event})`);
      return;
    }

    const data = await this.getData(resource);

    this.emitEvent(data);
  },
};
