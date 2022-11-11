import pipedream from "../../../pipedream/pipedream.app.mjs";
import googleCalendar from "../../google_calendar.app.mjs";
import { uuid } from "uuidv4";

const docLink = "https://pipedream.com/docs/examples/waiting-to-execute-next-step-of-workflow/#step-1-create-a-task-scheduler-event-source";

export default {
  key: "google_calendar-upcoming-event-alert",
  name: "Upcoming Event Alert",
  description: `Triggers based on a time interval before an upcoming event in the calendar.
    This source uses Pipedream's Task Scheduler.
    [See here](${docLink}) for more info and instructions to connect your Pipedream account.`,
  version: "0.0.1",
  type: "source",
  props: {
    pipedream,
    googleCalendar,
    db: "$.service.db",
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
    },
    eventId: {
      propDefinition: [
        googleCalendar,
        "eventId",
        (c) => ({
          calendarId: c.calendarId,
        }),
      ],
    },
    time: {
      type: "integer",
      label: "Minutes Before",
      description: `Number of minutes to trigger before the calendar event.
        \\
        You may use a custom expression to express in another unit. E.g. \`{{ 60 * 2 }}\` is 2 hours.`,
      min: 0,
    },
  },
  methods: {
    // To schedule future emits, we emit to the selfChannel of the component
    selfChannel() { return "self"; },
    subtractMinutes(date, minutes) {
      return date.getTime() - minutes * 60000;
    },
    async selfSubscribe() {
      // Subscribe the component to itself. We do this here because even in
      // the activate hook, the component isn't available to take subscriptions.
      // Scheduled tasks are sent to the self channel, which emits the message at
      // the specified delivery_ts to this component.
      if (!this.db.get("isSubscribedToSelf")) {
        const componentId = process.env.PD_COMPONENT;
        const selfChannel = this.selfChannel();
        console.log(`Subscribing to ${selfChannel} channel for event source`);
        await this.pipedream.subscribe(componentId, componentId, selfChannel);
        this.db.set("isSubscribedToSelf", true);
      }
    },
  },
  async run(event) {
    await this.selfSubscribe();
    const selfChannel = this.selfChannel();

    // INCOMING SCHEDULED EMIT
    if (event.$channel) {
      // Delete the channel name and id from the incoming event,
      // which were used only as metadata
      const { $id: id } = event;
      delete event.$channel;
      delete event.$id;
      this.$emit(event, {
        summary: "New event",
        id,
        ts: +new Date(),
      });
      return;
    }

    const id = uuid();
    const calendarEvent = await this.googleCalendar.getEvent({
      calendarId: this.calendarId,
      eventId: this.eventId,
    });

    const startTime = new Date(calendarEvent.start.dateTime || calendarEvent.start.date);
    const later = this.subtractMinutes(startTime, this.time);
    console.log(`Scheduled event to emit on: ${new Date(later)}`);

    // SCHEDULE
    this.$emit(
      {
        ...calendarEvent,
        $channel: selfChannel,
        $id: id,
      },
      {
        name: selfChannel,
        id,
        delivery_ts: later,
      },
    );
  },
};
