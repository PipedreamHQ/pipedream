import tave from "../../tave.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "tave-create-job",
  name: "Create Job",
  description: "Creates a new job in the Táve system with associated items typically linked with a job. [See the documentation](https://tave.io/v2)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    tave,
    jobDetails: {
      propDefinition: [
        tave,
        "jobDetails",
      ],
    },
    additionalItems: {
      type: "string",
      label: "Additional Items",
      description: "Additional items for the job",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Additional notes for the job",
      optional: true,
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "Additional instructions for the job",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.tave.createJob({
      ...this.jobDetails,
      additionalItems: this.additionalItems,
      notes: this.notes,
      instructions: this.instructions,
    });

    $.export("$summary", `Successfully created job with specifics: ${this.jobDetails.specifics}`);
    return response;
  },
};
