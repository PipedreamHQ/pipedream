import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-get-meeting-summary",
  name: "Get Meeting Summary",
  description: "Retrieve the AI-generated summary of a meeting. [See the documentation](https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/Getameetingsummary)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoomAdmin,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: `
- The host must have a Pro, Business, or higher subscription plan.
- For meetings - the host's Meeting Summary with AI Companion user setting must be enabled.
- For webinars - the host's Webinar Summary with AI Companion user setting must be enabled.
- End-to-End Encrypted (E2EE) meetings do not support summaries.

Learn more about [enabling or disabling AI Companion meeting summaries](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0057960&_ics=1771446392860&irclickid=~ae~a521XQPMHICGKIJzGxnovBDKLGwCvzrhab340WULKDzsmda90).`,
    },
    meetingId: {
      type: "string",
      label: "Meeting",
      description: "The meeting ID to retrieve the AI summary for. Only past meetings are listed.",
      withLabel: true,
      async options({
        prevContext, page,
      }) {
        if (!prevContext.nextPageToken && page > 0) {
          return [];
        }
        const data = await this.zoomAdmin.listMeetings(
          {
            type: "previous_meetings",
          },
          prevContext.nextPageToken,
        );
        return {
          options: (data?.meetings ?? []).map((meeting) => ({
            label: meeting.topic,
            value: meeting.id,
          })),
          context: {
            nextPageToken: data.next_page_token,
          },
        };
      },
    },
  },
  async run({ $ }) {
    const meetingId = this.meetingId?.value ?? this.meetingId;

    try {
      const { data: summary } = await this.zoomAdmin.getMeetingSummary({
        $,
        meetingId,
      });

      $.export("$summary", `Successfully retrieved AI summary for meeting ${meetingId}`);
      return summary;
    } catch (error) {
      const code = error?.response?.data?.code ?? error?.data?.code ?? error?.code;
      if (code === 3322) {
        throw new Error(`No AI summary found for meeting "${meetingId}". Ensure the meeting has ended and AI Companion was enabled before the meeting started.`);
      }
      throw error;
    }
  },
};
