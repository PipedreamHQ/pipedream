import sendloop from "../../sendloop.app.mjs";

export default {
  key: "sendloop-new-email-open-instant",
  name: "New Email Open Instant",
  description: "Emit new event when a subscriber opens an email.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    sendloop,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    emailAddress: {
      propDefinition: [
        sendloop,
        "emailAddress",
      ],
    },
    emailSubject: {
      propDefinition: [
        sendloop,
        "emailSubject",
      ],
      optional: true,
    },
    openTime: {
      propDefinition: [
        sendloop,
        "openTime",
      ],
      optional: true,
    },
    listId: {
      propDefinition: [
        sendloop,
        "listId",
      ],
    },
  },
  methods: {
    _getEvent() {
      return this.db.get("event") || null;
    },
    _setEvent(event) {
      this.db.set("event", event);
    },
  },
  async run() {
    const {
      emailAddress, listId,
    } = this;

    const subscriberEvents = await this.sendloop.getSubscriberEvents(emailAddress, listId);
    if (!subscriberEvents || subscriberEvents.length === 0) {
      console.log("No new events.");
      return;
    }

    const lastEvent = this._getEvent();
    subscriberEvents.forEach((event) => {
      if (lastEvent && lastEvent.id === event.id) return;

      this.$emit(event, {
        id: event.id,
        summary: `New email opened by ${event.emailAddress}`,
        ts: event.openTime
          ? new Date(event.openTime).getTime()
          : Date.now(),
      });

      this._setEvent(event);
    });
  },
};
