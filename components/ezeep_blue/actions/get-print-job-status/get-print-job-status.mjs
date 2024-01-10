import ezeepBlue from "../../ezeep_blue.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ezeep_blue-get-print-job-status",
  name: "Get Print Job Status",
  description: "Check the status of a specific print job. [See the documentation](https://developer.ezeep.com)",
  version: "0.0.{{ts}}",
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
    try {
      const status = await this.ezeepBlue.checkPrintJobStatus({
        jobid: this.jobid,
      });
      $.export("$summary", `Checked status of print job ${this.jobid}`);
      return {
        jobid: this.jobid,
        status,
      };
    } catch (error) {
      throw new Error(`Failed to check print job status: ${error.message}`);
    }
  },
};
