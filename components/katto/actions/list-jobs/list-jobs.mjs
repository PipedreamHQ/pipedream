import katto from "../../katto.app.mjs";

export default {
  key: "katto-list-jobs",
  name: "List Jobs",
  description:
    "List your clip jobs, newest first. [See the documentation](https://katto.tech/docs/api)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    katto,
    limit: {
      propDefinition: [
        katto,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.katto.listJobs({
      $,
      params: {
        limit: this.limit,
      },
    });
    const count = Array.isArray(response)
      ? response.length
      : (response.jobs?.length ?? response.data?.length ?? 0);
    $.export("$summary", `Retrieved ${count} job(s)`);
    return response;
  },
};
