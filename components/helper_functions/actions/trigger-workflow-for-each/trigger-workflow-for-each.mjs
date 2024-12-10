import helperFunctions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-trigger-workflow-for-each",
  name: "Trigger Workflow For Each",
  description: "Trigger another Pipedream workflow in your workspace for each object in an array.",
  version: "0.0.1",
  type: "action",
  props: {
    helperFunctions,
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The ID of the workflow to trigger. Workflow IDs are formatted as `p_******` and you can find a workflow's ID within the workflow builder URL.",
    },
    objects: {
      type: "any",
      label: "Array of Objects",
      description: "Use a custom expression (`{{steps.code.objects}}`) to reference an array of objects exported from a previous step to send to the triggered workflow.",
    },
  },
  async run({ $ }) {
    const {
      workflowId,
      objects,
    } = this;

    try {
      const results = [];
      const triggerPromises = objects.map((object) => $.flow.trigger(workflowId, object));
      for await (const result of triggerPromises) {
        results.push(result);
      }
      $.export("$summary", `Successfully triggered workflow ID **${workflowId}**`);
      return results;
    } catch (error) {
      $.export("$summary", `Failed to trigger workflow ID **${workflowId}**.`);
      throw error;
    }
  },
};
