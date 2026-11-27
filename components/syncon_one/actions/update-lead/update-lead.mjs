import syncOne from "../../syncon_one.app.mjs";

export default {
  key: "syncon_one-update-lead",
  name: "Update Lead",
  description: "Changes a lead in Syncon One. Only the fields you fill in are changed.",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: false, openWorldHint: true, readOnlyHint: false },
  props: {
    syncOne,
    id: {
      type: "string",
      label: "Lead ID",
      description: "The id of the lead, from an earlier step or a search.",
    },
    company: { type: "string", label: "Company", description: "The company.", optional: true },
    title: { type: "string", label: "Title", description: "The title.", optional: true },
    status: {
      type: "string",
      label: "Status",
      description: "The status.",
      optional: true,
      options: ["new", "working", "qualified", "meeting", "converted", "disqualified"],
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source.",
      optional: true,
      options: ["website", "manual", "import", "conversation"],
    },
    owner: { type: "string", label: "Owner", description: "The owner.", optional: true },
    estimated_value_cents: {
      type: "integer",
      label: "Estimated value",
      description: "The estimated value.",
      optional: true,
    },
    requirements: {
      type: "string",
      label: "What they need",
      description: "The what they need.",
      optional: true,
    },
    campaign: { type: "string", label: "Campaign", description: "The campaign.", optional: true },
    description: { type: "string", label: "Notes", description: "The notes.", optional: true },
    next_action_at: {
      type: "string",
      label: "Next action",
      description: "The next action.",
      optional: true,
    },
    lost_reason: { type: "string", label: "Reason", description: "The reason.", optional: true },
  },
  async run({ $ }) {
    const data = {};
    for (const key of [
      "company",
      "title",
      "status",
      "source",
      "owner",
      "estimated_value_cents",
      "requirements",
      "campaign",
      "description",
      "next_action_at",
      "lost_reason",
    ]) {
      if (this[key] !== undefined && this[key] !== "") data[key] = this[key];
    }
    const response = await this.syncOne.update({ $, path: "/leads", id: this.id, data });
    $.export("$summary", `Updated lead ${this.id}`);
    return response.data;
  },
};
