import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-worker-payslips",
  name: "List Worker Payslips",
  description: "List the payslips for a worker. [See the documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#common/v1/get-/workers/-ID-/paySlips)",
  version: "0.0.2",
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
    maxResults: {
      propDefinition: [
        workday,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = this.workday.paginate({
      fn: this.workday.listWorkerPayslips,
      args: {
        $,
        workerId: this.workerId,
      },
      max: this.maxResults,
    });

    const data = [];
    for await (const result of results) {
      data.push(result);
    }

    $.export("$summary", `Successfully fetched ${data.length} payslips for worker ${this.workerId}`);
    return data;
  },
};
