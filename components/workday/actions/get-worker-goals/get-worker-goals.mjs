import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-worker-goals",
  name: "Get Worker Goals",
  description: "Retrieve a worker's goals by worker ID. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#performanceEnablement/v5/get-/workers/-ID-/goals)",
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
    const response = await this.workday.getWorkerGoals({
      id: this.workerId,
      $,
    });
    $.export("$summary", `Fetched goals for worker ID ${this.workerId}`);
    return response;
  },
};
