import enrichlayer from "../../enrich_layer.app.mjs";

export default {
  key: "enrich_layer-get-job-profile",
  name: "Get Job Profile",
  description: "Get structured data of a Job Profile from a professional network job URL. Cost: 2 credits per successful request. [See the docs](https://enrichlayer.com/docs).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    url: {
      type: "string",
      label: "Job URL",
      description: "The professional network URL of the job posting (e.g., `https://www.linkedin.com/jobs/view/4222036951/`).",
    },
  },
  async run({ $ }) {
    const response = await this.enrichlayer._makeRequest({
      $,
      path: "/api/v2/job",
      params: {
        url: this.url,
      },
    });
    $.export("$summary", `Successfully retrieved job profile for ${this.url}`);
    return response;
  },
};
