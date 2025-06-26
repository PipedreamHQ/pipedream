import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";

export default {
  key: "add_to_calendar_pro-create-event",
  name: "Create Event",
  description: "Create an event in a group. [See the documentation](https://docs.add-to-calendar-pro.com/api/events#add-an-event)",
  version: "0.0.1",
  type: "action",
  props: {
    addToCalendarPro,
    groupProKey: {
      propDefinition: [
        addToCalendarPro,
        "groupProKey",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the event",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the event in format YYYY-MM-DD",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start time of the event in format HH:MM",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the event in format YYYY-MM-DD",
      optional: true,
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time of the event in format HH:MM",
      optional: true,
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "The timezone of the event. Example: `America/Los_Angeles`",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the event",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location of the event",
      optional: true,
    },
    rsvp: {
      type: "boolean",
      label: "RSVP",
      description: "Whether the event is an RSVP event",
      optional: true,
    },
    distribution: {
      type: "boolean",
      label: "Event Distribution",
      description: "Whether the event is distributed to all group members",
      optional: true,
    },
    hideButton: {
      type: "boolean",
      label: "Hide Button",
      description: "Whether the Add to Calendar button is hidden",
      optional: true,
    },
    cta: {
      type: "boolean",
      label: "Call to Action",
      description: "Whether the event has a call to action",
      optional: true,
    },
    styleId: {
      propDefinition: [
        addToCalendarPro,
        "styleId",
      ],
    },
    landingPageTemplateId: {
      propDefinition: [
        addToCalendarPro,
        "landingPageTemplateId",
      ],
    },
  },
  async run({ $ }) {
    const event = await this.addToCalendarPro.createEvent({
      $,
      data: {
        event_group: this.groupProKey,
        dates: [
          {
            name: this.name,
            startDate: this.startDate,
            startTime: this.startTime,
            endDate: this.endDate,
            endTime: this.endTime,
            timeZone: this.timeZone,
            description: this.description,
            location: this.location,
          },
        ],
        rsvp: this.rsvp,
        distribution: this.distribution,
        hideButton: this.hideButton,
        cta: this.cta,
        layout: this.styleId,
        landingpage: this.landingPageTemplateId,
      },
    });
    $.export("$summary", "Successfully created event.");
    return event;
  },
};
