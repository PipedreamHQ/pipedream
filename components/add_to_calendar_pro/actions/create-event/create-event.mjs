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
      propDefinition: [
        addToCalendarPro,
        "eventName",
      ],
    },
    startDate: {
      propDefinition: [
        addToCalendarPro,
        "startDate",
      ],
    },
    startTime: {
      propDefinition: [
        addToCalendarPro,
        "startTime",
      ],
    },
    endDate: {
      propDefinition: [
        addToCalendarPro,
        "endDate",
      ],
    },
    endTime: {
      propDefinition: [
        addToCalendarPro,
        "endTime",
      ],
    },
    timeZone: {
      propDefinition: [
        addToCalendarPro,
        "timeZone",
      ],
    },
    description: {
      propDefinition: [
        addToCalendarPro,
        "description",
      ],
    },
    location: {
      propDefinition: [
        addToCalendarPro,
        "location",
      ],
    },
    rsvp: {
      propDefinition: [
        addToCalendarPro,
        "rsvp",
      ],
    },
    distribution: {
      propDefinition: [
        addToCalendarPro,
        "distribution",
      ],
    },
    hideButton: {
      propDefinition: [
        addToCalendarPro,
        "hideButton",
      ],
    },
    cta: {
      propDefinition: [
        addToCalendarPro,
        "cta",
      ],
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
      optional: true,
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
