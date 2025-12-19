import googleCalendar from "../../google_calendar.app.mjs";
import taskScheduler from "../common/taskScheduler.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "google_calendar-upcoming-event-alert",
  name: "New Upcoming Event Alert",
  description: "Emit new event based on a time interval before an upcoming event in the calendar.",
  version: "0.1.1",
  type: "source",
  props: {
    googleCalendar,
    db: "$.service.db",
    http: "$.interface.http",
    pollingInfo: {
      type: "alert",
      alertType: "info",
      content: "This source requires a Pipedream API key to provide instant events. Alternatively, you can use the `upcoming-event-alert-polling` source instead, which operates on a timer and does not require a Pipedream API key.",
    },
    pipedreamApiKey: {
      type: "string",
      label: "Pipedream API Key",
      description: "[Click here to find your Pipedream API key](https://pipedream.com/settings/user)",
      secret: true,
    },
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
    },
    eventTypes: {
      propDefinition: [
        googleCalendar,
        "eventTypes",
      ],
    },
    time: {
      type: "integer",
      label: "Minutes Before",
      description: "Number of minutes to trigger before the start of the calendar event.",
      min: 0,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.time > 0) {
      props.timer = {
        type: "$.interface.timer",
        description: "Poll the API to schedule alerts for any newly created events",
        default: {
          intervalSeconds: 60 * this.time,
        },
      };
    }
    return props;
  },
  hooks: {
    async deactivate() {
      const ids = this._getScheduledEventIds();
      if (!ids?.length) {
        return;
      }
      for (const id of ids) {
        if (await this.deleteScheduledEvent({
          body: {
            id,
          },
        }, this.pipedreamApiKey)) {
          console.log("Cancelled scheduled event");
        }
      }
      this._setScheduledEventIds();
    },
  },
  methods: {
    ...taskScheduler.methods,
    _getScheduledEventIds() {
      return this.db.get("scheduledEventIds");
    },
    _setScheduledEventIds(ids) {
      this.db.set("scheduledEventIds", ids);
    },
    _getScheduledCalendarEventIds() {
      return this.db.get("scheduledCalendarEventIds");
    },
    _setScheduledCalendarEventIds(ids) {
      this.db.set("scheduledCalendarEventIds", ids);
    },
    _hasDeployed() {
      const result = this.db.get("hasDeployed");
      this.db.set("hasDeployed", true);
      return result;
    },
    subtractMinutes(date, minutes) {
      return date.getTime() - minutes * 60000;
    },
    async getCalendarEvents() {
      const calendarEvents = [];
      const params = {
        returnOnlyData: false,
        calendarId: this.calendarId,
        eventTypes: this.eventTypes,
      };
      do {
        const {
          data: {
            items, nextPageToken,
          },
        } = await this.googleCalendar.listEvents(params);
        if (items?.length) {
          calendarEvents.push(...items);
        }
        params.pageToken = nextPageToken;
      } while (params.pageToken);
      return calendarEvents;
    },
  },
  async run(event) {
    // self subscribe only on the first time
    if (!this._hasDeployed()) {
      await this.selfSubscribe(this.pipedreamApiKey);
    }

    const scheduledEventIds = this._getScheduledEventIds() || [];

    // incoming scheduled event
    if (event.$channel === this.selfChannel()) {
      const remainingScheduledEventIds = scheduledEventIds.filter((id) => id !== event["$id"]);
      this._setScheduledEventIds(remainingScheduledEventIds);
      this.emitEvent(event, `Upcoming ${event.summary
        ? event.summary + " "
        : ""}event`);
      return;
    }

    // schedule new events
    const scheduledCalendarEventIds = this._getScheduledCalendarEventIds() || {};
    const calendarEvents = await this.getCalendarEvents();

    for (const calendarEvent of calendarEvents) {
      const startTime = calendarEvent.start
        ? (new Date(calendarEvent.start.dateTime || calendarEvent.start.date))
        : null;
      if (!startTime
        || startTime.getTime() < Date.now()
        || scheduledCalendarEventIds[calendarEvent.id])
      {
        continue;
      }
      const later = new Date(this.subtractMinutes(startTime, this.time));

      const scheduledEventId = this.emitScheduleEvent(calendarEvent, later);
      scheduledEventIds.push(scheduledEventId);
      scheduledCalendarEventIds[calendarEvent.id] = true;
    }
    this._setScheduledEventIds(scheduledEventIds);
    this._setScheduledCalendarEventIds(scheduledCalendarEventIds);
  },
  sampleEmit,
};
