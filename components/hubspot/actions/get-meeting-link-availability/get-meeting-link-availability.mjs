import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-get-meeting-link-availability",
  name: "Get Meeting Link Availability",
  description: "Fetch the upcoming availability windows (and busy times) for a meeting scheduling page. Use this when you only need the open slots; use **Get Meeting Link Booking Info** for the full booking configuration. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/scheduler/guide#list-availability)",
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
  },
  async run({ $ }) {
    const response = await this.hubspot.getMeetingLinkAvailability({
      $,
      slug: this.slug,
      params: {
        timezone: this.timezone,
      },
    });

    const durationCount = Object.keys(
      response?.linkAvailability?.linkAvailabilityByDuration || {},
    ).length;

    $.export(
      "$summary",
      `Retrieved availability for meeting link "${this.slug}"${durationCount
        ? ` across ${durationCount} duration${durationCount === 1
          ? ""
          : "s"}`
        : ""}`,
    );

    return response;
  },
};
