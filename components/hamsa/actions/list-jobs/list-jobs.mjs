import hamsa from "../../hamsa.app.mjs";

export default {
  key: "hamsa-list-jobs",
  name: "List Jobs",
  description: "Fetch the list of jobs from Hamsa. [See the documentation](https://docs.tryhamsa.com/api-reference/endpoint/get-jobs-list)",
  version: "0.0.1",
  type: "action",
  props: {
    hamsa,
  },
  async run({ $ }) {
    const response = await this.hamsa.listJobs({
      $,
    });

    $.export("$summary", `Successfully fetched ${response?.data?.jobs?.legnth} jobs.`);

    return response;
  },
};
