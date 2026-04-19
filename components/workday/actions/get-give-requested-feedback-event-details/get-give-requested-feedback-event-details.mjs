import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-give-requested-feedback-event-details",
  name: "Get Give Requested Feedback Event Details",
  description: "Get details of a requested feedback event by ID. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#performanceEnablement/v5/get-/giveRequestedFeedbackEvents/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    giveRequestedFeedbackEventId: {
      propDefinition: [
        workday,
        "giveRequestedFeedbackEventId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.workday.getGiveRequestedFeedbackEvent({
      id: this.giveRequestedFeedbackEventId,
      $,
    });
    $.export("$summary", `Fetched details for feedback event ID ${this.giveRequestedFeedbackEventId}`);
    return response;
  },
};
