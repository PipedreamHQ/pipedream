import alttextify from "../../alttextify.app.mjs";

export default {
  key: "alttextify-get-alttext-by-job-id",
  name: "Retrieve Alt Text by Job ID",
  description: "Retrieve alt text for a previously submitted image using the job ID. [See the documentation](https://apidoc.alttextify.net/#api-Image-GetImagesByJobID)",
  version: "0.0.1",
  type: "action",
  props: {
    alttextify,
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the job for retrieving alt text.",
    },
  },
  async run({ $ }) {
    const response = await this.alttextify.retrieveAltTextByJobId({
      $,
      jobId: this.jobId,
    });
    $.export("$summary", `Successfully retrieved alt text by Job ID: ${this.jobId}`);

    return response;
  },
};
