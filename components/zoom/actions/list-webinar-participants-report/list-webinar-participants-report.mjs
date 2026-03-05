import utils from "../../common/utils.mjs";
import app from "../../zoom.app.mjs";

export default {
  key: "zoom-list-webinar-participants-report",
  name: "List Webinar Participants Report",
  description: "Retrieves detailed report on each webinar attendee. You can get webinar participant reports for the last 6 months. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/reportWebinarParticipants).",
  version: "0.0.10",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    webinarId: {
      propDefinition: [
        app,
        "webinarId",
      ],
    },
    nextPageToken: {
      propDefinition: [
        app,
        "nextPageToken",
      ],
    },
    max: {
      propDefinition: [
        app,
        "max",
      ],
    },
  },
  methods: {
    async listWebinarParticipantsReport({
      webinarId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/report/webinars/${utils.doubleEncode(webinarId)}/participants`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      webinarId,
      nextPageToken,
      max,
    } = this;

    const stream = await this.app.getResourcesStream({
      resourceFn: this.listWebinarParticipantsReport,
      resourceFnArgs: {
        step,
        webinarId,
        params: {
          page_size: 300,
          next_page_token: nextPageToken,
        },
      },
      resourceName: "participants",
      max,
    });

    const participants = await utils.streamIterator(stream);

    step.export("$summary", `Successfully retrieved ${utils.summaryEnd(participants.length, "participant")}.`);

    return participants;
  },
};
