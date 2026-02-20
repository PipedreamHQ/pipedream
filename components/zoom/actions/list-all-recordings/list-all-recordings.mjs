import constants from "../../common/constants.mjs";
import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-list-all-recordings",
  name: "List All Recordings",
  description: "List all cloud recordings for a user. [See the documentation](https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/recordingsList)",
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
- Must have a Pro or a higher plan.
- Must enable Cloud Recording on the user's account. Learn more about [enabling cloud recordings](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0063923&_ics=1771436993341&irclickid=~ae~a521XQPMHICGKIJzGxnovBDKLGwCvzrhab3431UMLKGzsjgd6) and [managing cloud recording settings](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0065362&_ics=1771436993341&irclickid=~ae~a521XQPMHICGKIJzGxnovBDKLGwCvzrhab3431UMLKGzsjgd6).`,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The user ID or email address of the user. Use `me` to retrieve recordings for the current user.",
      optional: true,
      default: "me",
    },
    from: {
      type: "string",
      label: "From",
      description: "Start date in `yyyy-mm-dd` UTC format. The maximum date range is a month. Defaults to the current date if not provided.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "End date in `yyyy-mm-dd` UTC format.",
      optional: true,
    },
    mc: {
      type: "string",
      label: "MC",
      description: "Query metadata of recording if an On-Premise Meeting Connector was used for the meeting.",
      optional: true,
    },
    trash: {
      type: "boolean",
      label: "Trash",
      description: "If `true`, list recordings from trash.",
      optional: true,
    },
    trashType: {
      type: "string",
      label: "Trash Type",
      description: "The type of Cloud recording to retrieve from trash. Should be used together with **Trash**.",
      optional: true,
      options: constants.CLOUD_RECORD_TRASH_TYPE_OPTIONS,
    },
    max: {
      propDefinition: [
        zoom,
        "max",
      ],
    },
  },
  async run({ $: step }) {
    const {
      userId,
      from,
      to,
      mc,
      trash,
      trashType,
      max,
    } = this;

    const recordings = [];

    const results = this.zoom.getResourcesStream({
      resourceFn: this.zoom.listRecordings,
      resourceFnArgs: {
        step,
        userId: userId || "me",
        params: {
          page_size: 300,
          from,
          to,
          mc,
          trash,
          trash_type: trashType,
        },
      },
      resourceName: "meetings",
      max,
    });

    for await (const recording of results) {
      recordings.push(recording);
    }

    step.export("$summary", `Successfully retrieved ${recordings.length} recording${recordings.length === 1
      ? ""
      : "s"}`);

    return recordings;
  },
};
