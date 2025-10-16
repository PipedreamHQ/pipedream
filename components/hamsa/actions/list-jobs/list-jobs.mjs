import hamsa from "../../hamsa.app.mjs";

export default {
  key: "hamsa-list-jobs",
  name: "List Jobs",
  description: "Fetch the list of jobs from Hamsa. [See the documentation](https://docs.tryhamsa.com/api-reference/endpoint/get-jobs-list)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hamsa,
  },
  async run({ $ }) {
    const response = await this.hamsa.listJobs({
      $,
    });

    $.export("$summary", `Successfully fetched ${response?.data?.jobs?.length} jobs.`);

    return response;
  },
};
