import googleCalendar from "../../google_calendar.app.mjs";
import createEventCommon from "../common/create-event-common.mjs";
import { v4 as uuidv4 } from "uuid";

export default {
  key: "google_calendar-create-event",
  name: "Create Event",
  description: "Create an event in a Google Calendar. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/insert)",
  version: "0.2.3",
  type: "action",
  props: {
    googleCalendar,
    addType: {
      type: "string",
      label: "Type of Add",
      description: "Whether to perform a quick add or a detailed event",
      options: [
        "quick add",
        "detailed event",
      ],
      reloadProps: true,
    },
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
    },
    summary: {
      label: "Event Title",
      type: "string",
      description: "Enter a title for the event, (e.g., `My event`)",
    },
    colorId: {
      propDefinition: [
        googleCalendar,
        "colorId",
      ],
      hidden: true,
    },
    timeZone: {
      propDefinition: [
        googleCalendar,
        "timeZone",
      ],
      hidden: true,
    },
    sendUpdates: {
      propDefinition: [
        googleCalendar,
        "sendUpdates",
      ],
      hidden: true,
    },
    sendNotifications: {
      propDefinition: [
        googleCalendar,
        "sendNotifications",
      ],
      hidden: true,
    },
  },
  async additionalProps(props) {
    const newProps = {};
    if (this.addType !== "detailed event") {
      return newProps;
    }
    props.summary.optional = true;
    props.colorId.hidden = false;
    props.timeZone.hidden = false;
    props.sendUpdates.hidden = false;
    props.sendNotifications.hidden = false;
    newProps.createMeetRoom = {
      label: "Create Meet Room",
      description: "Create a Google Meet room for this event.",
      type: "boolean",
      optional: true,
    };
    const commonProps = createEventCommon.props({
      isUpdate: false,
    });
    return {
      ...newProps,
      ...commonProps,
    };
  },
  methods: {
    ...createEventCommon.methods,
  },
  async run({ $ }) {
    if (this.addType === "quick add") {
      const quickResponse = await this.googleCalendar.quickAddEvent({
        calendarId: this.calendarId,
        text: this.summary,
      });
      $.export("$summary", `Successfully added a quick event: "${quickResponse.id}"`);
      return quickResponse;
    }

    const timeZone = await this.getTimeZone(this.timeZone);
    const attendees = this.formatAttendees(this.attendees);
    const recurrence = this.formatRecurrence({
      repeatFrequency: this.repeatFrequency,
      repeatTimes: this.repeatTimes,
      repeatUntil: this.repeatUntil,
    });

    const data = {
      calendarId: this.calendarId,
      sendUpdates: this.sendUpdates,
      sendNotifications: this.sendNotifications,
      resource: {
        summary: this.summary,
        location: this.location,
        description: this.description,
        start: this.getDateParam({
          date: this.eventStartDate,
          timeZone,
        }),
        end: this.getDateParam({
          date: this.eventEndDate,
          timeZone,
        }),
        recurrence,
        attendees,
        colorId: this.colorId,
      },
    };

    if (this.createMeetRoom) {
      data.conferenceDataVersion = 1;
      data.resource.conferenceData = {
        createRequest: {
          requestId: uuidv4(),
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      };
    }

    const response = await this.googleCalendar.createEvent(data);

    $.export("$summary", `Successfully created event with ID: "${response.id}"`);

    return response;
  },
};
