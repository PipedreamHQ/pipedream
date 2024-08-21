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
      description: "The event to be sent to the triggered workflow as the triggering event",
      optional: true,
    },
    resultType: {
      type: "string",
      label: "Result Type",
      description: "Set to `all_exports` to get $.exports of the triggered event as well as its $return_value: `{\"code\":{\"my_export\":\"value\",\"$return_value\":{\"hello\":\"world\"}},\"$context\":null}`",
      optional: true,
      options: [
        "all_exports",
      ],
    },
  },
  async run({ $ }) {
    const {
      workflowId,
      event = {},
      resultType,
    } = this;

    const result = resultType === "all_exports"
      ? await $.flow.trigger(workflowId, event, {
        result_type: resultType,
      })
      : await $.flow.trigger(workflowId, event);

    $.export("$summary", `Successfully triggerd workflow with ID: ${workflowId}`);

    return result;
  },
};
