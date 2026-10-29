import syncOne from "../../syncon_one.app.mjs";

export default {
  key: "syncon_one-create-task",
  name: "Create Task",
  description: "Adds a task in Syncon One, optionally on a customer, company, lead or deal.",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: false, openWorldHint: true, readOnlyHint: false },
  props: {
    syncOne,
    title: { type: "string", label: "Title", description: "The title." },
    description: {
      type: "string",
      label: "Description",
      description: "The description.",
      optional: true,
    },
    kind: {
      type: "string",
      label: "Kind",
      description: "The kind.",
      optional: true,
      options: ["task", "call", "meeting", "email", "follow_up"],
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority.",
      optional: true,
      options: ["low", "normal", "high", "urgent"],
    },
    due_at: { type: "string", label: "Due at", description: "The due at.", optional: true },
    all_day: { type: "boolean", label: "All day", description: "The all day.", optional: true },
    owner: {
      type: "string",
      label: "Member user id. Defaults to the key's creator.",
      description: "The member user id. defaults to the key's creator..",
      optional: true,
    },
    person: { type: "string", label: "Person", description: "The person.", optional: true },
    company: { type: "string", label: "Company", description: "The company.", optional: true },
    lead: { type: "string", label: "Lead", description: "The lead.", optional: true },
    opportunity: {
      type: "string",
      label: "Opportunity",
      description: "The opportunity.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    for (const key of [
      "title",
      "description",
      "kind",
      "priority",
      "due_at",
      "all_day",
      "owner",
      "person",
      "company",
      "lead",
      "opportunity",
    ]) {
      if (this[key] !== undefined && this[key] !== "") data[key] = this[key];
    }
    const response = await this.syncOne.create({ $, path: "/tasks", data });
    $.export("$summary", `Created task ${response.data?.id ?? ""}`);
    return response.data;
  },
};
