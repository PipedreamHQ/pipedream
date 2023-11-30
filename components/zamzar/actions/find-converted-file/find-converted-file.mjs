import zamzar from "../../zamzar.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zamzar-find-converted-file",
  name: "Find Converted File",
  description: "Finds the file that has been processed under the specified job id. [See the documentation](https://developers.zamzar.com/docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    zamzar,
    jobId: {
      propDefinition: [
        zamzar,
        "jobId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zamzar.findProcessedFile({
      jobId: this.jobId,
    });

    // Check if the job has been completed and has target files
    if (response.status === "successful" && response.target_files && response.target_files.length > 0) {
      // Export the summary and return the response with target files
      $.export("$summary", `Found processed file(s) for job ID ${this.jobId}`);
      return response.target_files;
    } else {
      // Export a summary indicating the job is not yet completed or has no files
      $.export("$summary", `No processed file found for job ID ${this.jobId}. Job status: ${response.status}`);
      return {
        message: `No processed file found for job ID ${this.jobId}. Job status: ${response.status}`,
      };
    }
  },
};
