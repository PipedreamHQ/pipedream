import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-list-build-annotations",
  name: "List Build Annotations",
  description: "Returns a list of annotations for a build. Annotations are Markdown snippets uploaded by agents during job execution. [See the documentation](https://buildkite.com/docs/apis/rest-api/annotations#list-annotations-for-a-build)",
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
      path: `/organizations/${this.organizationSlug}/pipelines/${this.pipelineSlug}/builds/${this.buildNumber}/annotations`,
    });
    $.export("$summary", `Found ${response.length} annotation(s)`);
    return response;
  },
};
