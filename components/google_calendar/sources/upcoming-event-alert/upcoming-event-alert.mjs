import taskScheduler from "../../../pipedream/sources/new-scheduled-tasks/new-scheduled-tasks.mjs";
import googleCalendar from "../../google_calendar.app.mjs";

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
    pipedream: taskScheduler.props.pipedream,
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
    ...taskScheduler.methods,
    subtractMinutes(date, minutes) {
      return date.getTime() - minutes * 60000;
    },
  },
  async run(event) {
    await this.selfSubscribe();

    if (event.$channel) {
      this.emitEvent(event);
      return;
    }

    const calendarEvent = await this.googleCalendar.getEvent({
      calendarId: this.calendarId,
      eventId: this.eventId,
    });

    const startTime = new Date(calendarEvent.start.dateTime || calendarEvent.start.date);
    const later = new Date(this.subtractMinutes(startTime, this.time));

    this.emitScheduleEvent(calendarEvent, later);
  },
};
