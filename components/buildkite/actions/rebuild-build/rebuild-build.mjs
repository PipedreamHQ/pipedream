import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-rebuild-build",
  name: "Rebuild Build",
  description: "Creates a new build from an existing build, preserving lineage. [See the documentation](https://buildkite.com/docs/apis/rest-api/builds#rebuild-a-build)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    buildkite,
    organizationSlug: {
      propDefinition: [
        buildkite,
        "organizationSlug",
      ],
    },
    pipelineSlug: {
      propDefinition: [
        buildkite,
        "pipelineSlug",
        (c) => ({
          organizationSlug: c.organizationSlug,
        }),
      ],
    },
    buildNumber: {
      propDefinition: [
        buildkite,
        "buildNumber",
        (c) => ({
          organizationSlug: c.organizationSlug,
          pipelineSlug: c.pipelineSlug,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.buildkite._makeRequest({
      $,
      method: "PUT",
      path: `/organizations/${this.organizationSlug}/pipelines/${this.pipelineSlug}/builds/${this.buildNumber}/rebuild`,
    });
    $.export("$summary", `Successfully rebuilt build #${this.buildNumber} — new build #${response.number}`);
    return response;
  },
};
