import circleci from "../../circleci.app.mjs";

export default {
  key: "circleci-rerun-workflow",
  name: "Rerun Workflow",
  description: "Reruns the specified workflow. [See the documentation](https://circleci.com/docs/api/v2/index.html#tag/Workflow/operation/rerunWorkflow)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    circleci,
    projectSlug: {
      propDefinition: [
        circleci,
        "projectSlug",
      ],
    },
    pipelineId: {
      propDefinition: [
        circleci,
        "pipelineId",
        (c) => ({
          projectSlug: c.projectSlug,
        }),
      ],
    },
    workflowId: {
      propDefinition: [
        circleci,
        "workflowId",
        (c) => ({
          pipelineId: c.pipelineId,
        }),
      ],
    },
    enableSsh: {
      type: "boolean",
      label: "Enable SSH",
      description: "Whether to enable SSH access for the triggering user on the newly-rerun job. Requires the jobs parameter to be used and so is mutually exclusive with the from_failed parameter.",
      optional: true,
    },
    fromFailed: {
      type: "boolean",
      label: "From Failed",
      description: "Whether to rerun the workflow from the failed job. Mutually exclusive with the jobs parameter.",
      optional: true,
    },
    jobIds: {
      propDefinition: [
        circleci,
        "jobIds",
        (c) => ({
          workflowId: c.workflowId,
        }),
      ],
    },
    sparseTree: {
      type: "boolean",
      label: "Sparse Tree",
      description: "",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.circleci.rerunWorkflow({
      $,
      workflowId: this.workflowId,
      data: {
        enable_ssh: this.enableSsh,
        from_failed: this.fromFailed,
        jobs: typeof this.jobIds === "string"
          ? JSON.parse(this.jobIds)
          : this.jobIds,
        sparse_tree: this.sparseTree,
      },
    });
    $.export("$summary", `Successfully started a rerun of workflow with ID: ${this.workflowId}`);
    return response;
  },
};
