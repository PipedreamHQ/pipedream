import ascora from "../../ascora.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ascora-create-update-job",
  name: "Create or Update a Job",
  description: "Creates a new job or modifies an existing one in Ascora. [See the documentation](https://support.ascora.com.au/display/as/api+endpoints)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ascora,
    jobDetails: {
      propDefinition: [
        ascora,
        "jobDetails",
      ],
    },
    jobId: {
      propDefinition: [
        ascora,
        "jobId",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      jobDetails, jobId,
    } = this;
    const response = await this.ascora.createOrModifyJob({
      jobDetails,
      jobId,
    });

    const summary = jobId
      ? `Updated job with ID ${jobId}`
      : `Created new job with details ${JSON.stringify(jobDetails)}`;
    $.export("$summary", summary);
    return response;
  },
};
