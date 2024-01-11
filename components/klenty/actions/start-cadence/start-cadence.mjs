import klenty from "../../klenty.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "klenty-start-cadence",
  name: "Start Cadence",
  description: "Starts a cadence in Klenty for a specific prospect. [See the documentation](https://support.klenty.com/en/articles/8193937-klenty-s-post-apis)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    klenty,
    jobid: {
      propDefinition: [
        klenty,
        "jobid",
      ],
    },
    async: {
      type: "boolean",
      label: "Async",
      description: "Set to true to make the request asynchronously.",
      optional: true,
      default: false,
    },
    prospectEmail: {
      propDefinition: [
        klenty,
        "prospectEmail",
        (c) => ({
          prevContext: c.prevContext,
        }),
      ],
    },
  },
  async run({ $ }) {
    if (this.async) {
      this.klenty.checkPrintJobStatus({
        jobid: this.jobid,
      });
      $.export("$summary", `Request to check print job status for job ID: ${this.jobid} sent asynchronously`);
      return {
        status: "Request sent asynchronously",
      };
    } else {
      const response = await this.klenty.checkPrintJobStatus({
        jobid: this.jobid,
      });
      $.export("$summary", `Checked the status of print job ID: ${this.jobid}`);
      return response;
    }
  },
};
