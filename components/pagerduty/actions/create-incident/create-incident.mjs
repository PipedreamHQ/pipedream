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
      propDefinition: [
        app,
        "incidentTitle",
      ],
    },
    serviceId: {
      propDefinition: [
        app,
        "serviceId",
      ],
    },
    urgency: {
      propDefinition: [
        app,
        "incidentUrgency",
      ],
    },
    incidentKey: {
      propDefinition: [
        app,
        "incidentKey",
      ],
    },
    bodyDetails: {
      propDefinition: [
        app,
        "incidentBodyDetails",
      ],
    },
    escalationPolicyId: {
      propDefinition: [
        app,
        "escalationPolicyId",
      ],
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
