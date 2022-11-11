import taskScheduler from "../../../pipedream/sources/new-scheduled-tasks/new-scheduled-tasks.mjs";
import googleCalendar from "../../google_calendar.app.mjs";
import { axios } from "@pipedream/platform";

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
    http: "$.interface.http",
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
  hooks: {
    async activate() {
      // workaround - self call run() because selfSubscribe() can't be run on activate or deploy
      // see selfSubscribe() method in pipedream/sources/new-scheduled-tasks/new-scheduled-tasks.mjs
      await axios(this, {
        url: this.http.endpoint,
        method: "POST",
        data: {
          schedule: true,
        },
      });
    },
    async deactivate() {
      const id = this._getScheduledEventId();
      if (id && await this.deleteEvent({
        body: {
          id,
        },
      })) {
        console.log("Cancelled scheduled event");
        this._setScheduledEventId();
      }
    },
  },
  methods: {
    ...taskScheduler.methods,
    _getScheduledEventId() {
      return this.db.get("scheduledEventId");
    },
    _setScheduledEventId(id) {
      this.db.set("scheduledEventId", id);
    },
    _hasDeployed() {
      const result = this.db.get("hasDeployed");
      this.db.set("hasDeployed", true);
      return result;
    },
    subtractMinutes(date, minutes) {
      return date.getTime() - minutes * 60000;
    },
  },
  async run(event) {
    // self subscribe only on the first time
    if (!this._hasDeployed()) {
      await this.selfSubscribe();
    }

    // incoming scheduled event
    if (event.$channel === this.selfChannel()) {
      this.emitEvent(event, `Upcoming ${event.summary} event`);
      this._setScheduledEventId();
      return;
    }

    // received schedule command
    if (event.body?.schedule) {
      const calendarEvent = await this.googleCalendar.getEvent({
        calendarId: this.calendarId,
        eventId: this.eventId,
      });

      const startTime = new Date(calendarEvent.start.dateTime || calendarEvent.start.date);
      const later = new Date(this.subtractMinutes(startTime, this.time));

      const scheduledEventId = this.emitScheduleEvent(calendarEvent, later);
      this._setScheduledEventId(scheduledEventId);
    }
  },
};
