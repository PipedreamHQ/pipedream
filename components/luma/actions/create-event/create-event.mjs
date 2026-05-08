import luma from "../../luma.app.mjs";
import {
  parseOptionalJsonArray,
  parseOptionalJsonObject,
} from "../../common/utils.mjs";

export default {
  key: "luma-create-event",
  name: "Create Event",
  description: "Create an event on the connected Luma calendar. Required datetime fields must be ISO 8601 strings and Timezone must be an IANA timezone like `America/New_York`. [See the documentation](https://docs.luma.com/reference/post_v1-event-create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    luma,
    name: {
      type: "string",
      label: "Name",
      description: "The event name.",
    },
    startAt: {
      type: "string",
      label: "Start At",
      description: "The event start time as an ISO 8601 datetime, for example `2026-05-15T18:00:00Z`.",
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The IANA timezone for the event, for example `America/New_York`.",
    },
    endAt: {
      type: "string",
      label: "End At",
      description: "The event end time as an ISO 8601 datetime, for example `2026-05-15T20:00:00Z`.",
      optional: true,
    },
    descriptionMd: {
      type: "string",
      label: "Description Markdown",
      description: "Markdown description to convert into Luma's rich text format.",
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "The event visibility.",
      optional: true,
      options: [
        "public",
        "members-only",
        "private",
      ],
    },
    slug: {
      type: "string",
      label: "Slug",
      description: "Custom event URL slug. If `aloha` is available, the event URL will be `https://luma.com/aloha`.",
      optional: true,
    },
    meetingUrl: {
      type: "string",
      label: "Meeting URL",
      description: "The online meeting URL for a virtual event.",
      optional: true,
    },
    coverUrl: {
      type: "string",
      label: "Cover URL",
      description: "A cover image URL uploaded to the Luma CDN.",
      optional: true,
    },
    maxCapacity: {
      type: "integer",
      label: "Max Capacity",
      description: "Maximum number of tickets or registrations before the event is sold out.",
      optional: true,
    },
    canRegisterForMultipleTickets: {
      type: "boolean",
      label: "Can Register For Multiple Tickets",
      description: "Whether guests can register for multiple tickets.",
      optional: true,
    },
    showGuestList: {
      type: "boolean",
      label: "Show Guest List",
      description: "Whether approved guests can see who else is attending.",
      optional: true,
    },
    remindersDisabled: {
      type: "boolean",
      label: "Reminders Disabled",
      description: "Whether to disable Luma's default event reminders.",
      optional: true,
    },
    nameRequirement: {
      type: "string",
      label: "Name Requirement",
      description: "How Luma should collect guest names during registration.",
      optional: true,
      options: [
        "full-name",
        "first-last",
      ],
    },
    phoneNumberRequirement: {
      type: "string",
      label: "Phone Number Requirement",
      description: "Whether guests must provide a phone number during registration.",
      optional: true,
      options: [
        "optional",
        "required",
      ],
    },
    tintColor: {
      type: "string",
      label: "Tint Color",
      description: "A hex color like `#bb2dc7`; alpha channels are stripped by Luma.",
      optional: true,
    },
    coordinateJson: {
      type: "string",
      label: "Coordinate JSON",
      description: "Optional JSON object for coordinates, formatted exactly as Luma's API expects.",
      optional: true,
    },
    geoAddressJson: {
      type: "string",
      label: "Geo Address JSON",
      description: "Optional JSON object for venue address data, formatted exactly as Luma's API expects.",
      optional: true,
    },
    registrationQuestionsJson: {
      type: "string",
      label: "Registration Questions JSON",
      description: "Optional JSON array of registration question objects, formatted exactly as Luma's API expects.",
      optional: true,
    },
    feedbackEmailJson: {
      type: "string",
      label: "Feedback Email JSON",
      description: "Optional JSON object for post-event feedback email settings, formatted exactly as Luma's API expects.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.luma.createEvent({
      $,
      data: {
        name: this.name,
        start_at: this.startAt,
        timezone: this.timezone,
        end_at: this.endAt,
        description_md: this.descriptionMd,
        visibility: this.visibility,
        slug: this.slug,
        meeting_url: this.meetingUrl,
        cover_url: this.coverUrl,
        max_capacity: this.maxCapacity,
        can_register_for_multiple_tickets: this.canRegisterForMultipleTickets,
        show_guest_list: this.showGuestList,
        reminders_disabled: this.remindersDisabled,
        name_requirement: this.nameRequirement,
        phone_number_requirement: this.phoneNumberRequirement,
        tint_color: this.tintColor,
        coordinate: parseOptionalJsonObject(this.coordinateJson, "Coordinate JSON"),
        geo_address_json: parseOptionalJsonObject(this.geoAddressJson, "Geo Address JSON"),
        registration_questions: parseOptionalJsonArray(
          this.registrationQuestionsJson,
          "Registration Questions JSON",
        ),
        feedback_email: parseOptionalJsonObject(this.feedbackEmailJson, "Feedback Email JSON"),
      },
    });
    const event = response?.event ?? response;
    const eventId = event?.id ?? event?.api_id ?? "event";

    $.export("$summary", `Created event ${eventId}: ${this.name}`);
    return response;
  },
};
