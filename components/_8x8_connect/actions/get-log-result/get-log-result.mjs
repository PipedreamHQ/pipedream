import app from "../../_8x8_connect.app.mjs";

export default {
  key: "_8x8_connect-get-log-result",
  name: "Get Log Result",
  description: "Check the status of an SMS Logs export job and to get a download link if its generation has succeeded. [See the documentation](https://developer.8x8.com/connect/reference/get-log-export-job-result)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    const response = await this.app.getLog({
      $,
      jobId: this.jobId,
    });

    $.export("$summary", `Successfully retrieved the log status: '${response.status}'`);

    return response;
  },
};
