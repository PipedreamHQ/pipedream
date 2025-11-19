import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "eventbrite-new-attendee-registered",
  name: "New Attendee Registered (Instant)",
  description: "Emit new event when an attendee registers for an event",
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
      return "order.placed";
    },
    async getData(order) {
      const {
        id: orderId, event_id: eventId,
      } = order;
      const attendeeStream = await this.resourceStream(
        this.eventbrite.getOrderAttendees.bind(this),
        "attendees",
        orderId,
      );
      const attendees = [];
      for await (const attendee of attendeeStream) {
        attendees.push(attendee);
      }
      const event = await this.eventbrite.getEvent(null, eventId, {
        expand: "ticket_classes",
      });
      return {
        order,
        attendees,
        event,
      };
    },
    generateMeta({ order }) {
      const {
        id, name: summary, created,
      } = order;
      return {
        id,
        summary,
        ts: Date.parse(created),
      };
    },
  },
  async run(event) {
    const url = event?.body?.api_url;
    if (!url) return;

    const resource = await this.eventbrite.getResource(url);

    if (this.event && resource.event_id !== this.event) {
      console.log(`Skipping order for event ${resource.event_id} (filtering for event ${this.event})`);
      return;
    }

    const data = await this.getData(resource);

    this.emitEvent(data);
  },
};
