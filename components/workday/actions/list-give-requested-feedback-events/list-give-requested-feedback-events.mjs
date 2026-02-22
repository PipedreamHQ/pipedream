import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-give-requested-feedback-events",
  name: "List Give Requested Feedback Events",
  description: "List all requested feedback events. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#performanceEnablement/v5/get-/giveRequestedFeedbackEvents)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
  },
  async run({ $ }) {
    const response = await this.workday.listGiveRequestedFeedbackEvents({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} feedback events`);
    return response;
  },
};
