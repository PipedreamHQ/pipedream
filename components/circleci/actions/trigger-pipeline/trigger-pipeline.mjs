import circleci from "../../circleci.app.mjs";

export default {
  key: "circleci-trigger-pipeline",
  name: "Trigger a Pipeline",
  description: "Trigger a pipeline given a pipeline definition ID. Supports all integrations except GitLab. [See the documentation](https://circleci.com/docs/api/v2/index.html#tag/Pipeline/operation/triggerPipelineRun)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    circleci,
    alert: {
      type: "alert",
      alertType: "info",
      content: "Supports all integrations except GitLab.",
    },
    projectSlug: {
      propDefinition: [
        circleci,
        "projectSlug",
      ],
    },
    definitionId: {
      type: "string",
      label: "Definition ID",
      description: "The unique ID for the pipeline definition. This can be found in the page Project Settings > Pipelines.",
    },
    configBranch: {
      type: "string",
      label: "Config Branch",
      description: "The branch that should be used to fetch the config file. Note that branch and tag are mutually exclusive. To trigger a pipeline for a PR by number use pull//head for the PR ref or pull//merge for the merge ref (GitHub only)",
      optional: true,
    },
    configTag: {
      type: "string",
      label: "Config Tag",
      description: "The tag that should be used to fetch the config file. The commit that this tag points to is used for the pipeline. Note that branch and tag are mutually exclusive.",
      optional: true,
    },
    checkoutBranch: {
      type: "string",
      label: "Checkout Branch",
      description: "The branch that should be used to check out code on a checkout step. Note that branch and tag are mutually exclusive. To trigger a pipeline for a PR by number use pull//head for the PR ref or pull//merge for the merge ref (GitHub only)",
      optional: true,
    },
    checkoutTag: {
      type: "string",
      label: "Checkout Tag",
      description: "The tag that should be used to check out code on a checkout step. The commit that this tag points to is used for the pipeline. Note that branch and tag are mutually exclusive.",
      optional: true,
    },
    parameters: {
      type: "object",
      label: "Parameters",
      description: "An object containing pipeline parameters and their values. Pipeline parameters have the following size limits: 100 max entries, 128 maximum key length, 512 maximum value length.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.circleci.triggerPipeline({
      $,
      projectSlug: this.projectSlug,
      data: {
        definition_id: this.definitionId,
        config: this.configBranch || this.configTag
          ? {
            branch: this.configBranch,
            tag: this.configTag,
          }
          : undefined,
        checkout: this.checkoutBranch || this.checkoutTag
          ? {
            branch: this.checkoutBranch,
            tag: this.checkoutTag,
          }
          : undefined,
        parameters: typeof this.parameters === "string"
          ? JSON.parse(this.parameters)
          : this.parameters,
      },
    });

    if (response?.id) {
      $.export("$summary", `Successfully triggered pipeline with ID: ${response.id}`);
    }
    return response;
  },
};
