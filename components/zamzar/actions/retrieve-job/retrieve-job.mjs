import app from "../../zamzar.app.mjs";

export default {
  key: "zamzar-retrieve-job",
  name: "Retrieve Job",
  description: "Finds the file that has been processed under the specified job id. [See the documentation](https://developers.zamzar.com/docs)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    jobId: {
      propDefinition: [
        app,
        "jobId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      jobId,
    } = this;

    const response = await app.retrieveJob({
      $,
      jobId,
    });

    $.export("$summary", `Successfully retrieved job with ID \`${response.id}\``);
    return response;
  },
};
