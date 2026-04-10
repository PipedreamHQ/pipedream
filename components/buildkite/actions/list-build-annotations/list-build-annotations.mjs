import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-list-build-annotations",
  name: "List Build Annotations",
  description: "Returns a list of annotations for a build. [See the documentation](https://buildkite.com/docs/apis/rest-api/annotations#list-annotations-for-a-build)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    limit: {
      propDefinition: [
        buildkite,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const results = [];
    for await (const annotation of this.buildkite.paginate({
      $,
      path: `/organizations/${this.organizationSlug}/pipelines/${this.pipelineSlug}/builds/${this.buildNumber}/annotations`,
      max: this.limit,
    })) {
      results.push(annotation);
    }
    $.export("$summary", `Successfully retrieved ${results.length} annotation(s)`);
    return results;
  },
};
