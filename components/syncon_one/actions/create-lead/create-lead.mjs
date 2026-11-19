import syncOne from "../../syncon_one.app.mjs";

export default {
  key: "syncon_one-create-lead",
  name: "Create Lead",
  description:
    "Adds a lead in Syncon One. [See the API reference](https://synconone.com/docs/api-reference).",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: false, openWorldHint: true, readOnlyHint: false },
  props: {
    syncOne,
    person: { type: "string", label: "Customer", description: "The customer.", optional: true },
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
      "person",
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
    const response = await this.syncOne.create({ $, path: "/leads", data });
    $.export("$summary", `Created lead ${response.data?.id ?? ""}`);
    return response.data;
  },
};
