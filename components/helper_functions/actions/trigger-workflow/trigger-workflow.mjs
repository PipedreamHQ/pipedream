import helperFunctions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-trigger-workflow",
  name: "Trigger Workflow",
  description: "Trigger another Pipedream workflow in your workspace.",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helperFunctions,
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The ID of the workflow to trigger. Workflow IDs are formatted as `p_******` and you can find a workflow’s ID within the workflow builder URL.",
    },
    event: {
      type: "object",
      label: "Event",
      description: "The event to be sent to the triggered workflow as the triggering event. In the triggered workflow, you can reference this event object with a custom expression (e.g., `{{steps.trigger.event}}`).",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      workflowId,
      event = {},
    } = this;

    const result = await $.flow.trigger(workflowId, event);

    $.export("$summary", `Successfully triggered workflow ID **${workflowId}**`);

    return result;
  },
};
