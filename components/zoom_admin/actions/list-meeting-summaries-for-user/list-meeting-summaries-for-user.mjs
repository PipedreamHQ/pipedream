import consts from "../../common/constants.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export default {
  key: "zoom_admin-list-meeting-summaries-for-user",
  name: "List Meeting Summaries for User",
  description: "Retrieve a list of meeting summaries for a specific user in the account. [See the documentation](https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/Listmeetingsummaries)",
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
    userId: {
      propDefinition: [
        zoomAdmin,
        "userId",
      ],
      description: "The user ID or email address of the user to retrieve meeting summaries for",
      optional: false,
    },
    from: {
      type: "string",
      label: "From Date",
      description: "Start date for meeting summaries in `yyyy-MM-dd` format. The date range defined by the `from` and `to` parameters should be a month as the response only includes meetings from a month. Example: `2024-01-01`",
    },
    to: {
      type: "string",
      label: "To Date",
      description: "End date for meeting summaries in `yyyy-MM-dd` format. The date range defined by the `from` and `to` parameters should be a month as the response only includes meetings from a month. Example: `2024-01-31`",
    },
    type: {
      type: "string",
      label: "Meeting Type",
      description: "Filter summaries by meeting type",
      optional: true,
      options: consts.MEETING_SUMMARY_TYPES,
    },
    max: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of meeting summaries to retrieve. Defaults to `300`.",
      optional: true,
      default: 300,
      min: 1,
    },
  },
  async run({ $ }) {
    const {
      userId,
      from,
      to,
      type,
      max,
    } = this;

    if (!DATE_REGEX.test(from)) {
      throw new Error(`Invalid "From Date" format: "${from}". Expected yyyy-MM-dd (e.g. 2024-01-01).`);
    }
    if (!DATE_REGEX.test(to)) {
      throw new Error(`Invalid "To Date" format: "${to}". Expected yyyy-MM-dd (e.g. 2024-01-31).`);
    }

    const summaries = [];

    const results = this.zoomAdmin.getResourcesStream({
      resourceFn: this.zoomAdmin.getMeetingSummaries,
      resourceFnArgs: {
        $,
        params: {
          userId,
          from,
          to,
          type,
        },
      },
      resourceName: "summaries",
      max,
    });

    for await (const summary of results) {
      summaries.push(summary);
    }

    $.export("$summary", `Successfully retrieved ${summaries.length} meeting ${summaries.length === 1
      ? "summary"
      : "summaries"} for user ${userId} from ${from} to ${to}`);

    return summaries;
  },
};
