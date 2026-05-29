import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-create-incident",
  name: "Create Incident",
  description:
    "Trigger a new incident on a PagerDuty service."
    + " Use **List Services** to find a service ID and **List Escalation Policies** to find a policy ID."
    + " Use **List Priorities** to find priority IDs."
    + " Set `incidentKey` to a stable value derived from the alert source (e.g. a hash of title + service ID) to prevent duplicate incidents on retry — PagerDuty deduplicates open incidents with the same key on the same service."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/b3A6Mjc0ODE0MA-create-an-incident)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    title: {
      type: "string",
      label: "Title",
      description: "A succinct description of the incident.",
    },
    serviceId: {
      type: "string",
      label: "Service ID",
      description: "The ID of the service to create the incident on. Use **List Services** to discover IDs.",
    },
    urgency: {
      type: "string",
      label: "Urgency",
      description: "Urgency of the incident. Options: `high`, `low`.",
      options: [
        "high",
        "low",
      ],
      optional: true,
    },
    incidentKey: {
      type: "string",
      label: "Incident Key (Dedup Key)",
      description: "Deduplication key. If an open incident with this key already exists on the same service, the request is rejected. Derive from a stable source (e.g. a hash of title + service_id) to prevent duplicates on retry.",
      optional: true,
    },
    bodyDetails: {
      type: "string",
      label: "Body Details",
      description: "Additional details about the incident.",
      optional: true,
    },
    escalationPolicyId: {
      type: "string",
      label: "Escalation Policy ID",
      description: "Override the service's default escalation policy. Use **List Escalation Policies** to discover IDs.",
      optional: true,
    },
    priorityId: {
      type: "string",
      label: "Priority ID",
      description: "The ID of the priority level. Use **List Priorities** to discover valid IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createIncident({
      $,
      data: {
        incident: {
          type: "incident",
          title: this.title,
          service: {
            id: this.serviceId,
            type: "service_reference",
          },
          urgency: this.urgency,
          incident_key: this.incidentKey,
          body: this.bodyDetails
            ? {
              type: "incident_body",
              details: this.bodyDetails,
            }
            : undefined,
          escalation_policy: this.escalationPolicyId
            ? {
              id: this.escalationPolicyId,
              type: "escalation_policy_reference",
            }
            : undefined,
          priority: this.priorityId
            ? {
              id: this.priorityId,
              type: "priority_reference",
            }
            : undefined,
        },
      },
    });

    const created = response.incident ?? response;
    $.export("$summary", `Created incident ${created.incident_number}: "${created.title}"`);
    return response;
  },
};
