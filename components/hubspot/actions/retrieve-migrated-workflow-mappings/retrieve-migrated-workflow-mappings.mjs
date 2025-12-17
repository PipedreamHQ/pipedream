import { parseObject } from "../../common/utils.mjs";
import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-retrieve-migrated-workflow-mappings",
  name: "Retrieve Migrated Workflow Mappings",
  description: "Retrieve the IDs of v3 workflows that have been migrated to the v4 API. [See the documentation](https://developers.hubspot.com/docs/api-reference/automation-automation-v4-v4/workflow-id-mappings/post-automation-v4-workflow-id-mappings-batch-read)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hubspot,
    flowIds: {
      propDefinition: [
        hubspot,
        "workflow",
        () => ({
          version: "V4",
        }),
      ],
      type: "string[]",
      label: "Flow IDs",
      description: "A list of flowIds from the V4 API.",
      optional: true,
    },
    workflow: {
      propDefinition: [
        hubspot,
        "workflow",
        () => ({
          version: "V3",
        }),
      ],
      type: "string[]",
      label: "Workflow IDs",
      description: "A list of workflowIds from the V3 API.",
      optional: true,
    },
  },
  async run({ $ }) {
    const parsedFlowIds = parseObject(this.flowIds) || [];
    const parsedWorkflowIds = parseObject(this.workflowIds) || [];

    const flowIds = [];
    const workflowIds = [];

    for (const flowId of parsedFlowIds) {
      flowIds.push({
        flowMigrationStatuses: `${flowId}`,
        type: "FLOW_ID",
      });
    }
    for (const workflowId of parsedWorkflowIds) {
      workflowIds.push({
        flowMigrationStatusForClassicWorkflows: `${workflowId}`,
        type: "WORKFLOW_ID",
      });
    }

    const response = await this.hubspot.getMigratedWorkflowMappings({
      $,
      data: {
        inputs: [
          ...flowIds,
          ...workflowIds,
        ],
      },
    });

    $.export("$summary", `Successfully retrieved ${response.results.length} migrated result(s) with ${response.errors?.length || 0} error(s)`);
    return response;
  },
};
