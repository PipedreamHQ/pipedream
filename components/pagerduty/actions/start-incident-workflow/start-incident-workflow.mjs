import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-start-incident-workflow",
  name: "Start Incident Workflow",
  description:
    "Start an automation workflow on an active incident."
    + " Use **List Incident Workflows** to discover available workflow IDs."
    + " Use **List Incidents** or **Get Incident** to find the incident ID."
    + " Requires Business+ plan — accounts without this plan will receive a 402 error."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/02bb39b038412-start-an-incident-workflow-instance)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    incidentId: {
      type: "string",
      label: "Incident ID",
      description: "The ID of the active incident. Use **List Incidents** or **Get Incident** to find IDs.",
    },
    incidentWorkflowId: {
      type: "string",
      label: "Incident Workflow ID",
      description: "The ID of the workflow to start. Use **List Incident Workflows** to discover available IDs.",
    },
  },
  async run({ $ }) {
    const response = await this.app.startIncidentWorkflow({
      $,
      incidentId: this.incidentId,
      data: {
        incident_workflow_instance: {
          incident_workflow: {
            id: this.incidentWorkflowId,
            type: "incident_workflow_reference",
          },
        },
      },
    });

    $.export("$summary", `Started workflow ${this.incidentWorkflowId} on incident ${this.incidentId}`);
    return response;
  },
};
