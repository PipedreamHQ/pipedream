import app from "../../ironclad.app.mjs";

export default {
  key: "ironclad-transition-workflow",
  name: "Transition Workflow",
  description: "Pauses, resumes, or cancels an in-flight Ironclad workflow."
    + " **When the workflow ID isn't known**, use **Search Workflows** or **Get Workflow** first to find it."
    + " `pause` temporarily halts the workflow; `resume` restarts a paused workflow; `cancel` permanently ends the workflow (cannot be undone)."
    + " [See the documentation](https://developer.ironcladapp.com/reference/pause-a-workflow)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The ID of the workflow to transition.",
    },
    action: {
      type: "string",
      label: "Action",
      description: "The lifecycle transition to perform.",
      options: [
        "pause",
        "resume",
        "cancel",
      ],
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "A comment explaining why this transition is being applied.",
    },
  },
  async run({ $ }) {
    const response = await this.app.transitionWorkflow({
      $,
      workflowId: this.workflowId,
      action: this.action,
      data: {
        comment: this.comment,
      },
    });

    $.export("$summary", `Workflow ${this.workflowId} transitioned: ${this.action}`);
    return response ?? {
      success: true,
      workflowId: this.workflowId,
      action: this.action,
    };
  },
};
