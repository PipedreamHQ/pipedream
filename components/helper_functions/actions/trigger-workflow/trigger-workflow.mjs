import helperFunctions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-trigger-workflow",
  name: "Trigger Workflow",
  description: "Invokes another workflow by its ID.",
  version: "0.0.1",
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
      description: "The event to be sent to the triggered workflow as the triggering event. In the triggered workflow, you can refer to this event object using the Custom Expression `{{steps.trigger.event}}`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      workflowId,
      event = {},
    } = this;

    const result = await $.flow.trigger(workflowId, event);

    $.export("$summary", `Successfully triggered workflow with ID: ${workflowId}`);

    return result;
  },
};
