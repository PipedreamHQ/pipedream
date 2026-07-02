import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-create-service",
  name: "Create Service",
  description:
    "Create a new PagerDuty service."
    + " A service represents a system or application that generates incidents."
    + " Use **List Escalation Policies** to find a valid escalation policy ID (required)."
    + " Set `autoResolveTimeout` to `0` to disable auto-resolve. Set `acknowledgementTimeout` to `0` to disable re-triggering after acknowledgment."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/7062f2631b397-create-a-service)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Service Name",
      description: "The name of the service.",
    },
    escalationPolicyId: {
      type: "string",
      label: "Escalation Policy ID",
      description: "The escalation policy for this service (required). Use **List Escalation Policies** to find IDs.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the service.",
      optional: true,
    },
    autoResolveTimeout: {
      type: "integer",
      label: "Auto-Resolve Timeout (seconds)",
      description: "Seconds after which triggered incidents auto-resolve. Set to `0` to disable. Default: 14400 (4 hours).",
      optional: true,
    },
    acknowledgementTimeout: {
      type: "integer",
      label: "Acknowledgement Timeout (seconds)",
      description: "Seconds after which acknowledged incidents re-trigger. Set to `0` to disable. Default: 1800 (30 min).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createService({
      $,
      data: {
        service: {
          type: "service",
          name: this.name,
          description: this.description,
          escalation_policy: {
            id: this.escalationPolicyId,
            type: "escalation_policy_reference",
          },
          auto_resolve_timeout: this.autoResolveTimeout,
          acknowledgement_timeout: this.acknowledgementTimeout,
        },
      },
    });

    const created = response.service ?? response;
    $.export("$summary", `Created service "${created.name}" (${created.id})`);
    return response;
  },
};
