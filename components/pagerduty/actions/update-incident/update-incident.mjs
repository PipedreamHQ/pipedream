import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-update-incident",
  name: "Update Incident",
  description:
    "Update an incident's status, title, urgency, priority, escalation policy, or assignments."
    + " Use **List Incidents** or **Get Incident** to find the incident ID."
    + " To acknowledge: set `status` to `acknowledged`. To resolve: set `status` to `resolved`."
    + " Use **List Users** to find user IDs for assignments and **List Priorities** for priority IDs."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/8a0e1aa2ec666-update-an-incident)",
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
      description: "The ID of the incident to update. Use **List Incidents** to find IDs.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "New status for the incident. Options: `acknowledged`, `resolved`.",
      options: [
        "acknowledged",
        "resolved",
      ],
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "New title for the incident.",
      optional: true,
    },
    urgency: {
      type: "string",
      label: "Urgency",
      description: "New urgency level. Options: `high`, `low`.",
      options: [
        "high",
        "low",
      ],
      optional: true,
    },
    priorityId: {
      type: "string",
      label: "Priority ID",
      description: "New priority. Use **List Priorities** to discover valid IDs.",
      optional: true,
    },
    escalationPolicyId: {
      type: "string",
      label: "Escalation Policy ID",
      description: "Reassign to a different escalation policy. Use **List Escalation Policies** to find IDs.",
      optional: true,
    },
    assignments: {
      type: "string[]",
      label: "Assignments (User IDs)",
      description: "Replace current assignments with these user IDs. Use **List Users** to find IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.updateIncident({
      $,
      incidentId: this.incidentId,
      data: {
        incident: {
          type: "incident",
          status: this.status,
          title: this.title,
          urgency: this.urgency,
          priority: this.priorityId
            ? {
              id: this.priorityId,
              type: "priority_reference",
            }
            : undefined,
          escalation_policy: this.escalationPolicyId
            ? {
              id: this.escalationPolicyId,
              type: "escalation_policy_reference",
            }
            : undefined,
          assignments: this.assignments?.map((id) => ({
            assignee: {
              id,
              type: "user_reference",
            },
          })),
        },
      },
    });

    const updated = response.incident ?? response;
    const changedField = this.status
      ? `status updated to ${updated.status}`
      : "updated";
    $.export("$summary", `Incident ${this.incidentId} ${changedField}`);
    return response;
  },
};
