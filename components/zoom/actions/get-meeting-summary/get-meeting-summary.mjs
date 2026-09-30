import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-get-meeting-summary",
  name: "Get Meeting Summary",
  description: "Retrieve the AI Companion summary of a past meeting or webinar."
    + " Use when you need what was discussed or decided in a meeting that has already ended."
    + " To find a meeting ID, call **List Meetings** first. A numeric meeting ID is resolved to its most recent ended instance."
    + " Returns the summary title and `summary_content` in Markdown."
    + " [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/summaries/get/meetings/{meetingId}/meeting_summary)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoom,
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
      propDefinition: [
        zoom,
        "meetingId",
        () => ({
          type: "previous_meetings",
        }),
      ],
      description: "The past meeting to retrieve the AI summary for. A numeric meeting ID returns the summary of its most recent ended instance; to target an earlier occurrence of a recurring meeting, pass that instance's UUID. Only past meetings are listed.",
      optional: false,
    },
  },
  async run({ $: step }) {
    const {
      zoom,
      meetingId,
    } = this;

    const meetingUuid = await zoom.resolvePastMeetingUuid({
      step,
      meetingId,
    });
    const summary = await zoom.getMeetingSummary({
      step,
      meetingId: meetingUuid,
    });

    step.export("$summary", `Successfully retrieved AI summary for meeting ${meetingId}`);
    return summary;
  },
};
