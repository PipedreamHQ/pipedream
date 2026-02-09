import { ConfigurationError } from "@pipedream/platform";
import calCom from "../../cal_com.app.mjs";

export default {
  key: "cal_com-create-booking-v2",
  name: "Create Booking (V2)",
  description: "Create a booking using Cal.com API v2 (Option 1). [See the documentation](https://cal.com/docs/api-reference/v2/bookings/create-a-booking)",
  version: "0.0.1",

  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },

  type: "action",

  props: {
    calCom,

    eventTypeId: {
      propDefinition: [
        calCom,
        "eventTypeId",
      ],
    },

    attendeeName: {
      type: "string",
      label: "Attendee Name",
      description: "Name of the attendee booking the event",
    },

    attendeeEmail: {
      type: "string",
      label: "Attendee Email",
      description: "Email address of the attendee booking the event",
    },

    attendeeTimeZone: {
      propDefinition: [
        calCom,
        "timeZone",
      ],
      description: "Time zone of the attendee",
    },

    attendeeLanguage: {
      propDefinition: [
        calCom,
        "language",
      ],
      description: "Preferred language of the attendee",
      optional: true,
    },

    start: {
      type: "string",
      label: "Start Time (UTC)",
      description:
        "Start time in ISO 8601 UTC format. Example: 2024-08-13T09:00:00Z",
    },

    locationType: {
      type: "string",
      label: "Location Type",
      description: "Type of location to use for the booking",
      options: [
        {
          label: "Integration (Zoom / Google Meet)",
          value: "integration",
        },
        {
          label: "Organizer Default",
          value: "organizersDefaultApp",
        },
      ],
    },

    integration: {
      type: "string",
      label: "Integration",
      description: "Video conferencing integration to use for the booking",
      optional: true,
      options: [
        "cal-video",
        "google-meet",
        "zoom",
        "whereby-video",
        "office365-video",
      ],
    },
  },

  async run({ $ }) {
    if (this.locationType === "integration" && !this.integration) {
      throw new ConfigurationError(
        "Integration is required when location type is 'integration'",
      );
    }

    const location =
      this.locationType === "integration"
        ? {
          type: "integration",
          integration: this.integration,
        }
        : {
          type: "organizersDefaultApp",
        };

    const data = {
      eventTypeId: this.eventTypeId,
      start: this.start,
      attendee: {
        name: this.attendeeName,
        email: this.attendeeEmail,
        timeZone: this.attendeeTimeZone,
        language: this.attendeeLanguage,
      },
      location,
    };

    try {
      const response = await this.calCom.createBookingV2({
        data,
        $,
      });

      $.export("$summary", `Successfully created booking with ID: ${response.data.id}`);
      return response;
    } catch (error) {
      let message = "Unknown error occurred while creating booking";
      if (typeof error === "string") {
        try {
          const errorJson = JSON.parse(error.slice(error.indexOf("{")));
          message = errorJson?.data?.message || message;
        } catch (error) {
          void error;
        }
      }
      throw new ConfigurationError(`Error: ${message}`);
    }
  },
};
