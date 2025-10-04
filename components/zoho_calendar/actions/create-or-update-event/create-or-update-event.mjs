import app from "../../zoho_calendar.app.mjs";
import { TIME_ZONES } from "../common/constants.mjs";

export default {
  key: "zoho_calendar-create-or-update-event",
  name: "Create or Update Event",
  description: "Create or update a event in a particular calendar of the user. [See the documentation](https://www.zoho.com/calendar/help/api/post-create-event.html)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    calendarId: {
      propDefinition: [
        app,
        "calendarId",
      ],
    },
    eventId: {
      propDefinition: [
        app,
        "eventId",
        (c) => ({
          calendarId: c.calendarId,
        }),
      ],
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start time of the event, The format should be`yyyyMMddTHHmmssZ` in GMT format or `yyyyMMdd`. e.g. `20230715T112200Z`",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time of the event, The format should be`yyyyMMddTHHmmssZ` in GMT format or `yyyyMMdd`. e.g. `20230715T132200Z`",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the event",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the event",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The timezone of the event",
      optional: true,
      options: TIME_ZONES,
    },
    isPrivate: {
      type: "boolean",
      label: "Is Private",
      description: "Whether the event is private or not",
      optional: true,
    },
    isAllDay: {
      type: "boolean",
      label: "Is All Day",
      description: "Whether the event is all day or not",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location of the event",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the event",
      optional: true,
    },
    guestAttendees: {
      type: "string[]",
      label: "Guest Attendees",
      description: "This param is used to include attendees with guest permissions. provide one email for each attendees, e.g. `['user1@domain.com', 'user2@domain.com']`",
      optional: true,
    },
    viewAttendees: {
      type: "string[]",
      label: "View Attendees",
      description: "This param is used to include attendees with viewing permissions. provide one email for each attendees, e.g. `['user1@domain.com', 'user2@domain.com']`",
      optional: true,
    },
    inviteAttendees: {
      type: "string[]",
      label: "Invite Attendees",
      description: "This param is used to include attendees with inviting permissions. provide one email for each attendees, e.g. `['user1@domain.com', 'user2@domain.com']`",
      optional: true,
    },
    editAttendees: {
      type: "string[]",
      label: "Edit Attendees",
      description: "This param is used to include attendees with editing permissions. provide one email for each attendees, e.g. `['user1@domain.com', 'user2@domain.com']`",
      optional: true,
    },
  },
  methods: {
    formatAttendees(attendees, permission) {
      return (attendees || []).map((email) => ({
        email,
        permission,
      }));
    },
    async getEtag($, calendarId, eventId) {
      if (eventId) {
        const { events } = await this.app.getEvent({
          $,
          calendarId,
          eventId,
        });
        console.log(events);
        return events[0]?.etag;
      }
      return undefined;
    },
  },
  async run({ $ }) {
    const {
      eventId,
      calendarId,
    } = this;

    const etag = await this.getEtag($, calendarId, eventId);

    const attendees = [];
    attendees.push(...this.formatAttendees(this.guestAttendees, 0));
    attendees.push(...this.formatAttendees(this.viewAttendees, 1));
    attendees.push(...this.formatAttendees(this.inviteAttendees, 2));
    attendees.push(...this.formatAttendees(this.editAttendees, 3));

    const data = {
      dateandtime: {
        start: this.startTime,
        end: this.endTime,
        timezone: this.timezone,
      },
      title: this.title,
      description: this.description,
      isprivate: this.isPrivate,
      isallday: this.isAllDay,
      location: this.location,
      url: this.url,
      etag,
      attendees: attendees.length
        ? attendees
        : undefined,
    };

    const method = eventId
      ? "updateEvent"
      : "createEvent";

    const result = await this.app[method]({
      $,
      calendarId,
      eventId,
      data,
    });
    $.export("$summary", `Successfully persisted calendar with UID: ${result?.events[0]?.uid}`);
    return result;
  },
};
