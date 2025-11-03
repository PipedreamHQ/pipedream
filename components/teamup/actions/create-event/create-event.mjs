import teamup from "../../teamup.app.mjs";

export default {
  key: "teamup-create-event",
  name: "Create Event",
  description: "Creates a new event on a specified calendar. [See the documentation](https://apidocs.teamup.com/docs/api/3269d0159ae9f-create-an-event)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    teamup,
    calendarKey: {
      propDefinition: [
        teamup,
        "calendarKey",
      ],
    },
    subCalendarIds: {
      propDefinition: [
        teamup,
        "subCalendarIds",
        (c) => ({
          calendarKey: c.calendarKey,
        }),
      ],
    },
    title: {
      propDefinition: [
        teamup,
        "title",
      ],
    },
    startDate: {
      propDefinition: [
        teamup,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        teamup,
        "endDate",
      ],
    },
    location: {
      propDefinition: [
        teamup,
        "location",
      ],
    },
    notes: {
      propDefinition: [
        teamup,
        "notes",
      ],
    },
  },
  async run({ $ }) {
    const { event } = await this.teamup.createEvent({
      calendarKey: this.calendarKey,
      data: {
        subcalendar_ids: this.subCalendarIds,
        title: this.title,
        start_dt: this.startDate,
        end_dt: this.endDate,
        location: this.location,
        notes: this.notes,
      },
      $,
    });

    if (event?.id) {
      $.export("$summary", `Successfully created event with id ${event.id}`);
    }

    return event;
  },
};
