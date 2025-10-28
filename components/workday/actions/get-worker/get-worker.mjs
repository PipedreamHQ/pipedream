import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-worker",
  name: "Get Worker",
  description: "Get a worker. [See the documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#common/v1/get-/workers/-ID-)",
  version: "0.0.3",
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
    const response = await this.workday.getWorker({
      $,
      workerId: this.workerId,
    });
    $.export("$summary", `Successfully fetched worker ${response.descriptor}`);
    return response;
  },
};
