import { ConfigurationError } from "@pipedream/platform";
import calCom from "../../cal_com.app.mjs";
import locationTypes from "../../common/location-types.mjs";

export default {
  key: "cal_com-create-booking",
  name: "Create Booking",
  description: "Create a new booking. [See the documentation](https://cal.com/docs/api-reference/v2/bookings/create-a-booking)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    calCom,
    bookingType: {
      type: "string",
      label: "Booking Type",
      description: "Type of booking to create. Use `booking` for a standard booking, `instant` for an instant team booking, or `recurring` to create multiple occurrences.",
      options: [
        {
          label: "Regular Booking",
          value: "booking",
        },
        {
          label: "Instant Booking (Team)",
          value: "instant",
        },
        {
          label: "Recurring Booking",
          value: "recurring",
        },
      ],
    },
    // Attendee
    attendeeName: {
      type: "string",
      label: "Attendee Name",
      description: "Full name of the attendee.",
    },
    attendeeEmail: {
      type: "string",
      label: "Attendee Email",
      description: "Email address of the attendee. Required unless **Attendee Phone Number** is provided.",
      optional: true,
    },
    attendeeTimeZone: {
      propDefinition: [
        calCom,
        "timeZone",
      ],
      label: "Attendee Time Zone",
      description: "Time zone of the attendee, e.g. `America/New_York`.",
    },
    attendeeLanguage: {
      propDefinition: [
        calCom,
        "language",
      ],
      label: "Attendee Language",
      description: "Language for the booking confirmation.",
      optional: true,
    },
    attendeePhoneNumber: {
      type: "string",
      label: "Attendee Phone Number",
      description: "Phone number in international format, e.g. `+919876543210`. Can be used instead of **Attendee Email** as the contact method. Required when the event type has SMS reminders enabled.",
      optional: true,
    },
    // Event type identification — provide eventTypeId OR (eventTypeSlug + username/teamSlug)
    eventTypeId: {
      propDefinition: [
        calCom,
        "eventTypeId",
      ],
      optional: true,
    },
    eventTypeSlug: {
      type: "string",
      label: "Event Type Slug",
      description: "Slug of the event type. Use with **Username** or **Team Slug** as an alternative to **Event Type ID**.",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "Username of the individual event owner. Required when using **Event Type Slug** for a personal event type.",
      optional: true,
    },
    teamSlug: {
      type: "string",
      label: "Team Slug",
      description: "Team slug. Required when using **Event Type Slug** for a team event type.",
      optional: true,
    },
    organizationSlug: {
      type: "string",
      label: "Organization Slug",
      description: "Organization slug. Optional when using slug-based event type identification.",
      optional: true,
    },
    // Timing
    start: {
      type: "string",
      label: "Start Time (UTC)",
      description: "Booking start time in ISO 8601 UTC format, e.g. `2024-08-13T09:00:00Z`.",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "Booking end time in ISO 8601 format. Optional — Cal.com derives end time from event type duration by default.",
      optional: true,
    },
    lengthInMinutes: {
      type: "integer",
      label: "Length (Minutes)",
      description: "Override the event type's default duration in minutes.",
      optional: true,
    },
    // Booking details
    guests: {
      type: "string[]",
      label: "Guests",
      description: "Additional guest email addresses to invite.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location Type",
      description: "Meeting location type. `attendeeAddress` requires **Address**, `attendeeDefined` requires **Location**, `attendeePhone` requires **Phone Number**, and `integration` requires **Integration**.",
      options: locationTypes.LOCATION_TYPES,
      optional: true,
    },
    locationAddress: {
      type: "string",
      label: "Address",
      description: "Used only if **Location Type** is `attendeeAddress`. Physical address provided by the attendee.",
      optional: true,
    },
    locationValue: {
      type: "string",
      label: "Location",
      description: "Used only if **Location Type** is `attendeeDefined`. Location string defined by the attendee.",
      optional: true,
    },
    locationPhone: {
      type: "string",
      label: "Phone Number",
      description: "Used only if **Location Type** is `attendeePhone`. Phone number in international format, e.g. `+919876543210`.",
      optional: true,
    },
    locationIntegration: {
      type: "string",
      label: "Integration",
      description: "Used only if **Location Type** is `integration`. Video conferencing integration to use for this booking.",
      options: locationTypes.INTEGRATION_OPTIONS,
      optional: true,
    },
    recurrenceCount: {
      type: "integer",
      label: "Recurrence Count",
      description: "Used only if **Booking Type** is `recurring`. Number of occurrences. Cannot exceed the event type's maximum recurrence count.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Custom key-value metadata, e.g. `{ \"source\": \"website\", \"campaignId\": \"abc-123\" }`. Max 50 keys; key names ≤ 40 chars, values ≤ 500 chars.",
      optional: true,
    },
    bookingFieldsResponses: {
      type: "object",
      label: "Booking Fields Responses",
      description: "Responses to custom booking form fields keyed by field slug, e.g. `{ \"company-name\": \"Acme Inc\", \"team-size\": \"10-50\" }`.",
      optional: true,
    },
    // Advanced / host-only
    allowConflicts: {
      type: "boolean",
      label: "Allow Conflicts",
      description: "Bypass availability checks and allow double-booking. Host use only.",
      optional: true,
    },
    allowBookingOutOfBounds: {
      type: "boolean",
      label: "Allow Booking Out of Bounds",
      description: "Allow booking outside the event type's scheduling window. Host use only.",
      optional: true,
    },
    emailVerificationCode: {
      type: "string",
      label: "Email Verification Code",
      description: "Required when the event type has email verification enabled.",
      optional: true,
    },
  },
  methods: {
    _buildLocation() {
      if (!this.location) return undefined;
      if (this.location === "attendeeAddress" && !this.locationAddress) {
        throw new ConfigurationError("Address is required when Location Type is attendeeAddress.");
      }
      if (this.location === "attendeeDefined" && !this.locationValue) {
        throw new ConfigurationError("Location is required when Location Type is attendeeDefined.");
      }
      if (this.location === "attendeePhone" && !this.locationPhone) {
        throw new ConfigurationError("Phone Number is required when Location Type is attendeePhone.");
      }
      if (this.location === "integration" && !this.locationIntegration) {
        throw new ConfigurationError("Integration is required when Location Type is integration.");
      }
      const loc = {
        type: this.location,
        ...(this.locationAddress && {
          address: this.locationAddress,
        }),
        ...(this.locationValue && {
          location: this.locationValue,
        }),
        ...(this.locationPhone && {
          phone: this.locationPhone,
        }),
        ...(this.locationIntegration && {
          integration: this.locationIntegration,
        }),
      };
      return loc;
    },
  },
  async run({ $ }) {
    // Validate start time
    const utcIsoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
    if (!utcIsoPattern.test(this.start)) {
      throw new ConfigurationError("Start time must be in UTC ISO 8601 format ending with 'Z', e.g. 2024-08-13T09:00:00Z.");
    }

    // Validate attendee contact method
    if (!this.attendeeEmail && !this.attendeePhoneNumber) {
      throw new ConfigurationError("Attendee must have at least one contact method. Provide Attendee Email or Attendee Phone Number.");
    }

    // Validate event type identification
    const hasEventTypeId = Boolean(this.eventTypeId);
    const hasPersonalSlug = Boolean(this.eventTypeSlug && this.username);
    const hasTeamSlug = Boolean(this.eventTypeSlug && this.teamSlug);
    const hasSlugIdentifier = hasPersonalSlug || hasTeamSlug;

    if (this.username && this.teamSlug) {
      throw new ConfigurationError("Provide Username or Team Slug with Event Type Slug, not both.");
    }
    if (hasEventTypeId === hasSlugIdentifier) {
      throw new ConfigurationError("Provide either Event Type ID, or Event Type Slug with Username/Team Slug, but not both.");
    }

    const data = {
      eventTypeId: this.eventTypeId,
      eventTypeSlug: this.eventTypeSlug,
      username: this.username,
      teamSlug: this.teamSlug,
      organizationSlug: this.organizationSlug,
      start: this.start,
      endTime: this.endTime,
      lengthInMinutes: this.lengthInMinutes,
      attendee: {
        name: this.attendeeName,
        email: this.attendeeEmail,
        timeZone: this.attendeeTimeZone,
        ...(this.attendeeLanguage && {
          language: this.attendeeLanguage,
        }),
        ...(this.attendeePhoneNumber && {
          phoneNumber: this.attendeePhoneNumber,
        }),
      },
      guests: this.guests,
      location: this._buildLocation(),
      metadata: this.metadata,
      bookingFieldsResponses: this.bookingFieldsResponses,
      allowConflicts: this.allowConflicts,
      allowBookingOutOfBounds: this.allowBookingOutOfBounds,
      emailVerificationCode: this.emailVerificationCode,
      ...(this.bookingType === "instant" && {
        instant: true,
      }),
      ...(this.bookingType === "recurring" && {
        recurrenceCount: this.recurrenceCount,
      }),
    };

    const response = await this.calCom.createBooking({
      data,
      $,
    });
    const bookingData = response?.data;
    const bookingUid = Array.isArray(bookingData)
      ? bookingData[0]?.uid
      : bookingData?.uid;
    $.export(
      "$summary",
      bookingUid
        ? `Successfully created booking with UID: ${bookingUid}`
        : "Successfully created booking",
    );
    return response;
  },
};
