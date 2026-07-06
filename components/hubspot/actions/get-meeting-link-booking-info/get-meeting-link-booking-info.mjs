import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-get-meeting-link-booking-info",
  name: "Get Meeting Link Booking Info",
  description: "Retrieve the booking configuration and availability for a meeting scheduling page. Returns link metadata, availability windows by duration, busy times, branding, and organizer details. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/scheduler/guide#list-booking-information)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
    slug: {
      propDefinition: [
        hubspot,
        "meetingLinkSlug",
      ],
    },
    timezone: {
      propDefinition: [
        hubspot,
        "meetingTimezone",
      ],
    },
    monthOffset: {
      type: "integer",
      label: "Month Offset",
      description: "Number of months ahead of the current date to fetch availability for. Defaults to the current month when omitted.",
      optional: true,
      min: 0,
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.getMeetingLinkBookingInfo({
      $,
      slug: this.slug,
      params: {
        timezone: this.timezone,
        monthOffset: this.monthOffset,
      },
    });

    $.export(
      "$summary",
      `Retrieved booking info for meeting link "${this.slug}"`,
    );

    return response;
  },
};
