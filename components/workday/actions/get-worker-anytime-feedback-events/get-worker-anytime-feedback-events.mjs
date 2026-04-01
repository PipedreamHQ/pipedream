import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-worker-anytime-feedback-events",
  name: "Get Worker Anytime Feedback Events",
  description: "Retrieve anytime feedback events for a worker by ID. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#performanceEnablement/v5/get-/workers/-ID-/anytimeFeedbackEvents)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    workerId: {
      propDefinition: [
        workday,
        "workerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.workday.getWorkerAnytimeFeedbackEvents({
      id: this.workerId,
      $,
    });
    $.export("$summary", `Fetched anytime feedback events for worker ID ${this.workerId}`);
    return response;
  },
};
