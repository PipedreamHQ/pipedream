import { ConfigurationError } from "@pipedream/platform";
import github from "../../github.app.mjs";

export default {
  key: "github-run-workflow",
  name: "Run Workflow",
  description: "Trigger a GitHub Actions workflow run, or re-run the failed jobs of a previous run. To start a new run, provide `workflow` (the workflow file name, e.g. `ci.yml`, its display name, or its numeric ID) and optionally `ref` (the branch or tag to run on — defaults to the repository's default branch) and `inputs` (for `workflow_dispatch` workflows). To re-run only the failed jobs of an existing run instead, provide `rerunFailedRunId`. The workflow must already have a `workflow_dispatch` trigger to be dispatchable. Use **List Workflows** to find the workflow file name and **List Workflow Runs** to find a run ID. Provide the repository as an `owner/repo` string. [See the documentation](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullnameStatic",
      ],
    },
    workflow: {
      type: "string",
      label: "Workflow",
      description: "The workflow to dispatch — its file name (e.g. `ci.yml`), display name, or numeric ID. Required unless re-running failed jobs. Use **List Workflows** to discover available workflows.",
      optional: true,
    },
    ref: {
      type: "string",
      label: "Ref",
      description: "The branch or tag to run the workflow on, e.g. `main`. Defaults to the repository's default branch.",
      optional: true,
    },
    inputs: {
      type: "object",
      label: "Inputs",
      description: "Input keys and values configured in the workflow's `workflow_dispatch` definition (max 10). Defaults from the workflow file are used for omitted inputs.",
      optional: true,
    },
    rerunFailedRunId: {
      type: "string",
      label: "Re-run Failed Run ID",
      description: "Provide a workflow run ID here to re-run only its failed jobs instead of dispatching a new run. Use **List Workflow Runs** to find a run ID.",
      optional: true,
    },
  },
  methods: {
    // Resolve a workflow file name / display name to the value the dispatch
    // endpoint accepts (file name or numeric ID). Lets "eval" resolve to
    // "eval.yml" in a single call rather than forcing a List Workflows step.
    async resolveWorkflowId(repoFullname, workflow) {
      // Numeric ID or already a workflow file name — use as-is.
      if (/^\d+$/.test(workflow) || /\.ya?ml$/i.test(workflow)) {
        return workflow;
      }
      const { workflows } = await this.github.listWorkflows({
        repoFullname,
        perPage: 100,
        page: 1,
      });
      const target = workflow.toLowerCase();
      const match = workflows.find((wf) => {
        const fileName = wf.path.split("/").pop();
        const stem = fileName.replace(/\.ya?ml$/i, "");
        return [
          wf.name?.toLowerCase(),
          fileName.toLowerCase(),
          stem.toLowerCase(),
          String(wf.id),
        ].includes(target);
      });
      if (!match) {
        throw new ConfigurationError(`No workflow matching "${workflow}" found. Use **List Workflows** to see available workflows.`);
      }
      return match.path.split("/").pop();
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);

    if (this.rerunFailedRunId) {
      const response = await this.github.rerunFailedJobs({
        repoFullname,
        workflowRunId: this.rerunFailedRunId,
      });
      $.export("$summary", `Re-ran failed jobs for workflow run ${this.rerunFailedRunId}`);
      return response;
    }

    if (!this.workflow) {
      throw new ConfigurationError("Provide a `workflow` to dispatch, or a `rerunFailedRunId` to re-run failed jobs.");
    }

    const ref = this.ref ?? (await this.github.getRepo({
      repoFullname,
    })).default_branch;

    const workflowId = await this.resolveWorkflowId(repoFullname, this.workflow);

    const response = await this.github.createWorkflowDispatch({
      repoFullname,
      workflowId,
      data: {
        ref,
        inputs: this.inputs,
      },
    });

    $.export("$summary", `Dispatched workflow \`${workflowId}\` on \`${ref}\``);

    return response;
  },
};
