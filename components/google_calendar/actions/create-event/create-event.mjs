import googleCalendar from "../../google_calendar.app.mjs";
import createEventCommon from "../common/create-event-common.mjs";
import { v4 as uuidv4 } from "uuid";
import constants from "../../common/constants.mjs";

export default {
  key: "google_calendar-create-event",
  name: "Create Event",
  description: "Create an event in a Google Calendar. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/insert)",
  version: "0.2.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleCalendar,
    addType: {
      type: "string",
      label: "Type of Add",
      description: "Whether to perform a quick add or a detailed event",
      options: [
        {
          label: "Add Detailed Event",
          value: "detailed",
        },
        {
          label: "Add Quick Event using Natural Language",
          value: "quick",
        },
      ],
      reloadProps: true,
    },
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
    },
    text: {
      type: "string",
      label: "Describe Event",
      description: "Write a plain text description of event, and Google will parse this string to create the event. eg. 'Meet with Michael 10am 7/22/2024' or 'Call Sarah at 1:30PM on Friday'",
      hidden: true,
    },
    summary: {
      label: "Event Title",
      type: "string",
      description: "Enter a title for the event, (e.g., `My event`)",
      optional: true,
      hidden: true,
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
    createMeetRoom: {
      type: "boolean",
      label: "Create Meet Room",
      description: "Whether to create a Google Meet room for this event.",
      optional: true,
      hidden: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Visibility of the event",
      options: [
        "default",
        "public",
        "private",
        "confidential",
      ],
      optional: true,
      hidden: true,
    },
  },
  async additionalProps(props) {
    const isDetailed = this.addType === "detailed";

    props.text.hidden = isDetailed;

    props.summary.hidden = !isDetailed;
    props.colorId.hidden = !isDetailed;
    props.timeZone.hidden = !isDetailed;
    props.sendUpdates.hidden = !isDetailed;
    props.createMeetRoom.hidden = !isDetailed;
    props.visibility.hidden = !isDetailed;

    if (isDetailed) {
      const commonProps = createEventCommon.props({
        isUpdate: false,
      });
      if (this.repeatFrequency) {
        const frequency = constants.REPEAT_FREQUENCIES[this.repeatFrequency];
        commonProps.repeatInterval.description = `Enter 1 to "repeat every ${frequency}", enter 2 to "repeat every other ${frequency}", etc. Defaults to 1.`;
        commonProps.repeatInterval.hidden = !this.repeatFrequency;
        commonProps.repeatUntil.hidden = !this.repeatFrequency;
        commonProps.repeatTimes.hidden = !this.repeatFrequency;
      }
      return commonProps;
    }
    return {};
  },
  methods: {
    ...createEventCommon.methods,
  },
  async run({ $ }) {
    if (this.addType === "quick") {
      const quickResponse = await this.googleCalendar.quickAddEvent({
        calendarId: this.calendarId,
        text: this.text,
      });
      $.export("$summary", `Successfully added a quick event: "${quickResponse.id}"`);
      return quickResponse;
    }

    const timeZone = await this.getTimeZone(this.timeZone);
    const attendees = this.formatAttendees(this.attendees);
    const recurrence = this.formatRecurrence({
      repeatFrequency: this.repeatFrequency,
      repeatInterval: this.repeatInterval,
      repeatTimes: this.repeatTimes,
      repeatUntil: this.repeatUntil,
    });

    const data = {
      calendarId: this.calendarId,
      sendUpdates: this.sendUpdates,
      resource: {
        summary: this.summary,
        location: this.location,
        description: this.description,
        start: {
          date: this.eventStartDate?.length <= 10
            ? this.eventStartDate
            : undefined,
          dateTime: this.eventStartDate?.length > 10
            ? this.eventStartDate
            : undefined,
          timeZone,
        },
        end: {
          date: this.eventEndDate?.length <= 10
            ? this.eventEndDate
            : undefined,
          dateTime: this.eventEndDate?.length > 10
            ? this.eventEndDate
            : undefined,
          timeZone,
        },
        recurrence,
        attendees,
        colorId: this.colorId,
        visibility: this.visibility,
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
