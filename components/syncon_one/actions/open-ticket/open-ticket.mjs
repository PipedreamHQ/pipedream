import syncOne from "../../syncon_one.app.mjs";

export default {
  key: "syncon_one-open-ticket",
  name: "Open Ticket",
  description: "Opens a support ticket in Syncon One.",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: false, openWorldHint: true, readOnlyHint: false },
  props: {
    syncOne,
    subject: { type: "string", label: "Subject", description: "The subject." },
    summary: { type: "string", label: "Summary", description: "The summary.", optional: true },
    priority: {
      type: "string",
      label: "Defaults to medium. SLA targets follow it.",
      description: "The defaults to medium. sla targets follow it..",
      optional: true,
      options: ["low", "medium", "high", "urgent"],
    },
    assignee: {
      type: "string",
      label: "Member user id.",
      description: "The member user id..",
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
      "subject",
      "summary",
      "priority",
      "assignee",
      "person",
      "company",
      "lead",
      "opportunity",
    ]) {
      if (this[key] !== undefined && this[key] !== "") data[key] = this[key];
    }
    const response = await this.syncOne.create({ $, path: "/tickets", data });
    $.export("$summary", `Opened ticket ${response.data?.id ?? ""}`);
    return response.data;
  },
};
