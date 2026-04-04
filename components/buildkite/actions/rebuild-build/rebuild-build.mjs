import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-rebuild-build",
  name: "Rebuild Build",
  description: "Creates a new build from an existing build. The new build preserves lineage and shows as \"rebuilt from\" the original. [See the documentation](https://buildkite.com/docs/apis/rest-api/builds#rebuild-a-build)",
  version: "0.0.1",
  type: "action",
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
      ],
    },
  },
  async run({ $ }) {
    const response = await this.buildkite._makeRequest({
      $,
      method: "PUT",
      path: `/organizations/${this.organizationSlug}/pipelines/${this.pipelineSlug}/builds/${this.buildNumber}/rebuild`,
    });
    $.export("$summary", `Rebuilt build #${this.buildNumber} — new build #${response.number}`);
    return response;
  },
};
