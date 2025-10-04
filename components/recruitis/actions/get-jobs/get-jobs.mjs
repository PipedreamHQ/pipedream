import app from "../../recruitis.app.mjs";

export default {
  key: "recruitis-get-jobs",
  name: "Get Jobs",
  description: "Get jobs from recruitis profile. [See the documentation](https://docs.recruitis.io/api/#tag/Jobs/paths/~1jobs/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getJobs({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.payload.length} job(s)`);

    return response;
  },
};
