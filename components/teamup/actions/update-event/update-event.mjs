import teamup from "../../teamup.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "teamup-update-event",
  name: "Update Event",
  description: "Updates an existing event on a specified calendar. [See the documentation](https://apidocs.teamup.com/docs/api/8b5d0d1556103-update-an-event)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    eventId: {
      propDefinition: [
        teamup,
        "eventId",
        (c) => ({
          calendarKey: c.calendarKey,
        }),
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
      optional: true,
    },
    title: {
      propDefinition: [
        teamup,
        "title",
      ],
      optional: true,
    },
    startDate: {
      propDefinition: [
        teamup,
        "startDate",
      ],
      optional: true,
    },
    endDate: {
      propDefinition: [
        teamup,
        "endDate",
      ],
      optional: true,
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
    const { event: originalEvent } = await this.teamup.getEvent({
      calendarKey: this.calendarKey,
      eventId: this.eventId,
      $,
    });

    const data = utils.cleanObject({
      id: this.eventId,
      subcalendar_ids: this.subCalendarIds || originalEvent.subcalendar_ids,
      title: this.title,
      start_dt: this.startDate || originalEvent.start_dt,
      end_dt: this.endDate || originalEvent.end_dt,
      location: this.location,
      notes: this.notes,
    });
    const { event } = await this.teamup.updateEvent({
      calendarKey: this.calendarKey,
      eventId: this.eventId,
      data,
      $,
    });

    if (event?.id) {
      $.export("$summary", `Successfully updated event with id ${event.id}`);
    }

    return event;
  },
};
