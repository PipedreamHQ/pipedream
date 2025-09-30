import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";

export default {
  key: "add_to_calendar_pro-update-event",
  name: "Update Event",
  description: "Update an event in a group. [See the documentation](https://docs.add-to-calendar-pro.com/api/events#update-an-event)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    addToCalendarPro,
    eventProKey: {
      propDefinition: [
        addToCalendarPro,
        "eventProKey",
      ],
    },
    titleEventSeries: {
      propDefinition: [
        addToCalendarPro,
        "titleEventSeries",
      ],
    },
    simplifiedRecurrence: {
      propDefinition: [
        addToCalendarPro,
        "simplifiedRecurrence",
      ],
    },
    recurrence: {
      propDefinition: [
        addToCalendarPro,
        "recurrence",
      ],
    },
    recurrenceSimpleType: {
      propDefinition: [
        addToCalendarPro,
        "recurrenceSimpleType",
      ],
    },
    recurrenceInterval: {
      propDefinition: [
        addToCalendarPro,
        "recurrenceInterval",
      ],
    },
    recurrenceByDay: {
      propDefinition: [
        addToCalendarPro,
        "recurrenceByDay",
      ],
    },
    recurrenceByMonth: {
      propDefinition: [
        addToCalendarPro,
        "recurrenceByMonth",
      ],
    },
    recurrenceByMonthDay: {
      propDefinition: [
        addToCalendarPro,
        "recurrenceByMonthDay",
      ],
    },
    recurrenceCount: {
      propDefinition: [
        addToCalendarPro,
        "recurrenceCount",
      ],
    },
    recurrenceWeekStart: {
      propDefinition: [
        addToCalendarPro,
        "recurrenceWeekStart",
      ],
    },
    iCalFileName: {
      propDefinition: [
        addToCalendarPro,
        "iCalFileName",
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
    rsvpTemplateId: {
      propDefinition: [
        addToCalendarPro,
        "rsvpTemplateId",
      ],
      optional: true,
    },
    ctaTemplateId: {
      propDefinition: [
        addToCalendarPro,
        "ctaTemplateId",
      ],
      optional: true,
    },
    numberOfDates: {
      type: "integer",
      label: "Number of Dates",
      description: "The number of dates to create for the event",
      reloadProps: true,
    },
  },
  additionalProps() {
    const props = {};
    if (!this.numberOfDates) {
      return props;
    }
    for (let i = 0; i < this.numberOfDates; i++) {
      props[`name${i}`] = {
        type: "string",
        label: `Title of Date ${i + 1}`,
        description: `The title of Date ${i + 1}`,
        optional: true,
      };
      props[`startDate${i}`] = {
        type: "string",
        label: `Start Date of Date ${i + 1}`,
        description: `The start date of Date ${i + 1} in format YYYY-MM-DD`,
        optional: true,
      };
      props[`startTime${i}`] = {
        type: "string",
        label: `Start Time of Date ${i + 1}`,
        description: `The start time of Date ${i + 1} in format HH:MM`,
        optional: true,
      };
      props[`endDate${i}`] = {
        type: "string",
        label: `End Date of Date ${i + 1}`,
        description: `The end date of Date ${i + 1} in format YYYY-MM-DD`,
        optional: true,
      };
      props[`endTime${i}`] = {
        type: "string",
        label: `End Time of Date ${i + 1}`,
        description: `The end time of Date ${i + 1} in format HH:MM`,
        optional: true,
      };
      props[`timeZone${i}`] = {
        type: "string",
        label: `Time Zone of Date ${i + 1}`,
        description: `The time zone of Date ${i + 1}. Example: "America/Los_Angeles"`,
        optional: true,
      };
      props[`description${i}`] = {
        type: "string",
        label: `Description of Date ${i + 1}`,
        description: `The description of Date ${i + 1}`,
        optional: true,
      };
      props[`location${i}`] = {
        type: "string",
        label: `Location of Date ${i + 1}`,
        description: `The location of Date ${i + 1}`,
        optional: true,
      };
      props[`availability${i}`] = {
        type: "string",
        label: `Availability of Date ${i + 1}`,
        description: `The availability of Date ${i + 1}`,
        options: [
          "free",
          "busy",
        ],
        optional: true,
      };
      props[`organizerName${i}`] = {
        type: "string",
        label: `Organizer Name of Date ${i + 1}`,
        description: `The organizer name of Date ${i + 1}`,
        optional: true,
      };
      props[`organizerEmail${i}`] = {
        type: "string",
        label: `Organizer Email of Date ${i + 1}`,
        description: `The organizer email of Date ${i + 1}`,
        optional: true,
      };
      props[`attendeeName${i}`] = {
        type: "string",
        label: `Attendee Name of Date ${i + 1}`,
        description: `The attendee name of Date ${i + 1}`,
        optional: true,
      };
      props[`attendeeEmail${i}`] = {
        type: "string",
        label: `Attendee Email of Date ${i + 1}`,
        description: `The attendee email of Date ${i + 1}`,
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const dates = [];
    for (let i = 0; i < this.numberOfDates; i++) {
      dates.push({
        name: this[`name${i}`],
        startDate: this[`startDate${i}`],
        startTime: this[`startTime${i}`],
        endDate: this[`endDate${i}`],
        endTime: this[`endTime${i}`],
        timeZone: this[`timeZone${i}`],
        description: this[`description${i}`],
        location: this[`location${i}`],
        availability: this[`availability${i}`],
        organizerName: this[`organizerName${i}`],
        organizerEmail: this[`organizerEmail${i}`],
        attendeeName: this[`attendeeName${i}`],
        attendeeEmail: this[`attendeeEmail${i}`],
      });
    }

    const response = await this.addToCalendarPro.updateEvent({
      $,
      eventProKey: this.eventProKey,
      data: {
        dates,
        title_event_series: this.titleEventSeries,
        simplified_recurrence: this.simplifiedRecurrence,
        recurrence: this.recurrence,
        recurrence_simple_type: this.recurrenceSimpleType,
        recurrence_interval: this.recurrenceInterval,
        recurrence_byDay: this.recurrenceByDay,
        recurrence_byMonth: this.recurrenceByMonth,
        recurrence_byMonthDay: this.recurrenceByMonthDay,
        recurrence_count: this.recurrenceCount,
        recurrence_weekstart: this.recurrenceWeekStart,
        iCalFileName: this.iCalFileName,
        rsvp: this.rsvp,
        rsvp_block: this.rsvpTemplateId,
        distribution: this.distribution,
        hideButton: this.hideButton,
        cta: this.cta,
        cta_block: this.ctaTemplateId,
        layout: this.styleId,
        landingpage: this.landingPageTemplateId,
      },
    });
    $.export("$summary", "Successfully updated event.");
    return response;
  },
};
