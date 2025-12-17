import eventbrite from "../../eventbrite.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "eventbrite-create-event",
  name: "Create Event",
  description: "Create a new Eventbrite event. [See the documentation](https://www.eventbrite.com/platform/api#/reference/event/create/create-an-event)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    eventbrite,
    organization: {
      propDefinition: [
        eventbrite,
        "organization",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Event name. Value cannot be empty nor whitespace",
    },
    summary: {
      type: "string",
      label: "Summary",
      description:
        "Event summary. This is a plaintext field and will have any supplied HTML removed from it. Maximum of 140 characters",
      optional: true,
    },
    timezone: {
      propDefinition: [
        eventbrite,
        "timezone",
      ],
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description:
        "The event start time relative to UTC. (Ex. 2018-05-12T02:00:00Z).",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description:
        "The event end time relative to UTC. (Ex. 2018-05-12T02:00:00Z)",
    },
    hideStartDate: {
      type: "boolean",
      label: "Hide Start Date",
      description: "Whether the start date should be hidden. Defaults to false if left blank.",
      optional: true,
    },
    hideEndDate: {
      type: "boolean",
      label: "Hide End Date",
      description: "Whether the end date should be hidden. Defaults to false if left blank.",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The ISO 4217 currency code for this event",
      default: "USD",
    },
    onlineEvent: {
      type: "boolean",
      label: "Online Event",
      description: "If this event doesn't have a venue and is only held online. Defaults to false if left blank.",
      optional: true,
    },
    organizerId: {
      type: "string",
      label: "Organizer ID",
      description: "ID of the event organizer",
      optional: true,
    },
    logoId: {
      type: "string",
      label: "Logo ID",
      description: "Image ID of the event logo",
      optional: true,
    },
    venueId: {
      type: "string",
      label: "Venue ID",
      description: "Event venue ID",
      optional: true,
    },
    formatId: {
      type: "string",
      label: "Format ID",
      description: "Event format",
      optional: true,
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "Event category",
      optional: true,
    },
    subcategoryId: {
      type: "string",
      label: "Subcategory ID",
      description: "Event subcategory (US only)",
      optional: true,
    },
    listed: {
      type: "boolean",
      label: "Listed",
      description: "Is this event publicly searchable on Eventbrite? Defaults to true.",
      default: true,
    },
    shareable: {
      type: "boolean",
      label: "Shareable",
      description: "Can this event show social sharing buttons? Defaults to false if left blank.",
      optional: true,
    },
    inviteOnly: {
      type: "boolean",
      label: "Invite Only",
      description: "Can only people with invites see the event page?. Defaults to false if left blank.",
      optional: true,
    },
    showRemaining: {
      type: "boolean",
      label: "Show Remaining",
      description:
        "If the remaining number of tickets is publicly visible on the event page. Defaults to false if left blank.",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password needed to see the event in unlisted mode",
      optional: true,
    },
    capacity: {
      type: "integer",
      label: "Capacity",
      description: "Set specific capacity (if omitted, sums ticket capacities)",
      optional: true,
    },
    isReservedSeating: {
      type: "boolean",
      label: "Is Reserved Seating",
      description: "If the event is reserved seating. Defaults to false if left blank.",
      optional: true,
    },
    isSeries: {
      type: "boolean",
      label: "Is Series",
      description:
        "If the event is part of a series. Specifying this attribute as True during event creation will always designate the event as a series parent, never as a series occurrence. Series occurrences must be created through the schedules API and cannot be created using the events API. Defaults to false if left blank.",
      optional: true,
    },
    showPickASeat: {
      type: "boolean",
      label: "Show Pick A Seat",
      description:
        "For reserved seating event, if attendees can pick their seats. Defaults to false if left blank.",
      optional: true,
    },
    showSeatmapThumbnail: {
      type: "boolean",
      label: "Show Seatmap Thumbnail",
      description:
        "For reserved seating event, if venue map thumbnail visible on the event page. Defaults to false if left blank.",
      optional: true,
    },
    showColorsInSeatmapThumbnail: {
      type: "boolean",
      label: "Show Colors In Seatmap Thumbnail",
      description:
        "For reserved seating event, if venue map thumbnail should have colors on the event page. Defaults to false if left blank.",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "Source of the event (defaults to API)",
      optional: true,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "Indicates event language on Event's listing page. Language options from Eventbrite documentation: https://www.eventbrite.com/platform/api#/reference/event/retrieve/create-an-event",
      options: constants.LOCALE,
      default: "en_US",
    },
  },
  async run({ $ }) {
    /* convert start and end time to UTC in case time was entered with timezone offset */
    const startTime = (new Date(this.startTime)).toISOString()
      .split(".")[0] + "Z";
    const endTime = (new Date(this.endTime)).toISOString()
      .split(".")[0] + "Z";

    let data = {
      event: {
        name: {
          html: this.name,
        },
        summary: this.summary,
        start: {
          timezone: this.timezone,
          utc: startTime,
        },
        end: {
          timezone: this.timezone,
          utc: endTime,
        },
        hide_start_date: this.hideStartDate,
        hide_end_date: this.hideEndDate,
        currency: this.currency,
        online_event: this.onlineEvent,
        organizer_id: this.organizerId,
        logo_id: this.logoId,
        venue_id: this.venueId,
        format_id: this.formatId,
        category_id: this.categoryId,
        subcategory_id: this.subcategoryId,
        listed: this.listed,
        shareable: this.shareable,
        invite_only: this.inviteOnly,
        show_remaining: this.showRemaining,
        password: this.password,
        capacity: this.capacity,
        is_reserved_seating: this.isReservedSeating,
        is_series: this.isSeries,
        show_pick_a_seat: this.showPickASeat,
        show_seatmap_thumbnail: this.showSeatmapThumbnail,
        show_colors_in_seatmap_thumbnail: this.showColorsInSeatmapThumbnail,
        source: this.source,
        locale: this.locale,
      },
    };
    data = JSON.parse(JSON.stringify(data));
    const event = await this.eventbrite.createEvent($, this.organization, data);
    $.export("$summary", "Successfully created an event");
    return event;
  },
};
