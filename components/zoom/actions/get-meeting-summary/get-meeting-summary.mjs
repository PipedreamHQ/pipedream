import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-get-meeting-summary",
  name: "Get Meeting Summary",
  description: "Retrieve the summary of a meeting or webinar. [See the documentation](https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/Getameetingsummary)",
  version: "0.0.1",
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
      description: "The meeting ID or meeting UUID to retrieve the AI summary for. Only past meetings are listed.",
      optional: false,
    },
  },
  async run({ $: step }) {
    const {
      zoom,
      meetingId,
    } = this;

    try {
      const summary = await zoom.getMeetingSummary({
        step,
        meetingId,
      });

      step.export("$summary", `Successfully retrieved AI summary for meeting ${meetingId}`);
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
