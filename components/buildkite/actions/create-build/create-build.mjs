import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-create-build",
  name: "Create Build",
  description: "Creates a new build for a pipeline. [See the documentation](https://buildkite.com/docs/apis/rest-api/builds#create-a-build)",
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
    commit: {
      type: "string",
      label: "Commit",
      description: "The ref, SHA, or tag to build (e.g. `HEAD`, `abc123`)",
      default: "HEAD",
    },
    branch: {
      type: "string",
      label: "Branch",
      description: "The branch to build (e.g. `main`)",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message for the build",
      optional: true,
    },
    env: {
      type: "object",
      label: "Environment Variables",
      description: "Environment variables to pass to the build",
      optional: true,
    },
    metaData: {
      type: "object",
      label: "Meta Data",
      description: "Key-value meta-data to attach to the build",
      optional: true,
    },
    cleanCheckout: {
      type: "boolean",
      label: "Clean Checkout",
      description: "Force a fresh checkout, removing any existing build directory",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const data = {
      commit: this.commit,
      branch: this.branch,
    };
    if (this.message) data.message = this.message;
    if (this.env) data.env = this.env;
    if (this.metaData) data.meta_data = this.metaData;
    if (this.cleanCheckout) data.clean_checkout = true;
    const response = await this.buildkite._makeRequest({
      $,
      method: "POST",
      path: `/organizations/${this.organizationSlug}/pipelines/${this.pipelineSlug}/builds`,
      data,
    });
    $.export("$summary", `Successfully created build #${response.number} on ${this.branch}`);
    return response;
  },
};
