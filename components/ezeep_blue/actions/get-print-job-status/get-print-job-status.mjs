import ezeepBlue from "../../ezeep_blue.app.mjs";

export default {
  key: "ezeep_blue-get-print-job-status",
  name: "Get Print Job Status",
  description: "Check the status of a specific print job. [See the documentation](https://apidocs.ezeep.com/ezeepblue/api/printapi/README.html#get-status)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ezeepBlue,
    jobid: {
      propDefinition: [
        ezeepBlue,
        "jobid",
      ],
    },
  },
  async run({ $ }) {
    const status = await this.ezeepBlue.getPrintJobStatus({
      params: {
        id: this.jobid,
      },
    });
    $.export("$summary", `Checked status of print job ${this.jobid}`);
    return status;
  },
};
