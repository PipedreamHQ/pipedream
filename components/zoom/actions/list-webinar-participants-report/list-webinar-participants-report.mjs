import app from "../../zoom.app.mjs";

export default {
  key: "zoom-list-webinar-participants-report",
  name: "List Webinar Participants Report",
  description: "Retrieves detailed report on each webinar attendee. You can get webinar participant reports for the last 6 months. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/reportWebinarParticipants).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    webinarId: {
      propDefinition: [
        app,
        "webinarId",
      ],
    },
  },
  methods: {
    async listWebinarParticipantsReport({
      webinarId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/report/webinars/${webinarId}/participants`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.listWebinarParticipantsReport({
      step,
      webinarId: this.webinarId,
      params: {
        page_size: 300,
      },
    });

    step.export("$summary", `Successfully retrieved ${response.participants.length} webinar participants report`);

    return response;
  },
};
