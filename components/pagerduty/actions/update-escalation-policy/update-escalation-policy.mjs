import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-update-escalation-policy",
  name: "Update Escalation Policy",
  description:
    "Update an escalation policy's name, description, loop count, or escalation rules."
    + " By default, performs a read-then-merge: fetches the current policy and merges your changes before writing, so you only need to specify the fields you want to change."
    + " Set `fullReplacement: true` to replace all rules wholesale — use with caution as this is destructive."
    + " Use **List Escalation Policies** to find the policy ID."
    + " Each escalation rule targets one or more users or schedules: provide `targets` as an array of objects with `id` and `type` (`user_reference` or `schedule_reference`)."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/f9b1e15e70a0c-update-an-escalation-policy)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    escalationPolicyId: {
      type: "string",
      label: "Escalation Policy ID",
      description: "The ID of the escalation policy to update. Use **List Escalation Policies** to find IDs.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "New name for the escalation policy.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "New description for the escalation policy.",
      optional: true,
    },
    numLoops: {
      type: "integer",
      label: "Number of Loops",
      description: "How many times to loop through the escalation rules before the incident is escalated no further. Set to `0` for infinite.",
      optional: true,
    },
    escalationRules: {
      type: "string",
      label: "Escalation Rules (JSON)",
      description: "JSON array of escalation rules to set. Each rule: `{\"escalation_delay_in_minutes\": 30, \"targets\": [{\"id\": \"USER_ID\", \"type\": \"user_reference\"}]}`. Use **List Users** and **List Schedules** to find target IDs. When provided without `fullReplacement: true`, these rules replace only the rules of the current policy.",
      optional: true,
    },
    fullReplacement: {
      type: "boolean",
      label: "Full Replacement",
      description: "When `true`, skips the read-then-merge and sends only the fields you provide. All unspecified rules are removed. Use with caution.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    let currentPolicy = {};

    if (!this.fullReplacement) {
      const existing = await this.app.getEscalationPolicy({
        $,
        escalationPolicyId: this.escalationPolicyId,
      });
      currentPolicy = existing.escalation_policy ?? existing;
    }

    const update = {
      type: "escalation_policy",
      ...currentPolicy,
      name: this.name ?? currentPolicy.name,
      description: this.description ?? currentPolicy.description,
      num_loops: this.numLoops ?? currentPolicy.num_loops,
      escalation_rules: this.escalationRules
        ? JSON.parse(this.escalationRules)
        : currentPolicy.escalation_rules,
    };

    // Remove fields that cannot be sent in a PUT
    delete update.id;
    delete update.html_url;
    delete update.self;
    delete update.summary;
    delete update.last_incident_timestamp;
    delete update.teams;
    delete update.services;

    const response = await this.app.updateEscalationPolicy({
      $,
      escalationPolicyId: this.escalationPolicyId,
      data: {
        escalation_policy: update,
      },
    });

    const updated = response.escalation_policy ?? response;
    $.export("$summary", `Updated escalation policy "${updated.name ?? this.escalationPolicyId}"`);
    return response;
  },
};
