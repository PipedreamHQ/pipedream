import waiverfile from "../../waiverfile.app.mjs";

export default {
  key: "waiverfile-update-event",
  name: "Update Event",
  description: "Updates the details of an existing event in WaiverFile. [See the documentation](https://api.waiverfile.com/swagger/ui/index#!/WaiverEvent/WaiverEvent_UpdateEvent)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    waiverfile,
    eventId: {
      propDefinition: [
        waiverfile,
        "eventId",
      ],
    },
    name: {
      type: "string",
      label: "Event Name",
      description: "The new name for the event",
      optional: true,
    },
    dateStart: {
      type: "string",
      label: "Start Date",
      description: "The new start date for the event in ISO-8601 format. For example, `2024-01-19T01:00:00Z`",
      optional: true,
    },
    dateEnd: {
      type: "string",
      label: "End Date",
      description: "The new end date for the event in ISO-8601 format. For example, `2024-01-19T01:00:00Z",
      optional: true,
    },
    isAllDay: {
      type: "boolean",
      label: "Is All Day",
      description: "Set to true for an all-day event",
      optional: true,
    },
    categoryId: {
      propDefinition: [
        waiverfile,
        "categoryId",
      ],
      optional: true,
    },
    waiverFormIds: {
      propDefinition: [
        waiverfile,
        "waiverFormIds",
      ],
      optional: true,
    },
  },
  methods: {
    async getEventById(eventId, $) {
      const response = await this.waiverfile.listUpcomingEvents({
        $,
        params: {
          startDateUTC: new Date(),
          endDateUTC: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        },
      });
      const events = JSON.parse(response);
      return events.find(({ WaiverEventID: id }) => id === eventId);
    },
  },
  async run({ $ }) {
    const event = await this.getEventById(this.eventId, $); console.log(event);
    const response = await this.waiverfile.updateEvent({
      $,
      params: {
        eventID: this.eventId,
        eventName: this.name || event.Name,
        dateEnd: this.dateEnd || event.DateEnd,
        dateStart: this.dateStart || event.DateStart,
        isAllDay: this.isAllDay || event.IsAllDay,
        eventCategoryID: this.categoryId || event.CategoryID,
        waiverFormIds: this.waiverFormIds || event.WaiverEventFormIDs,
      },
    });
    $.export("$summary", `Successfully updated event with ID ${this.eventId}`);
    return response;
  },
};
