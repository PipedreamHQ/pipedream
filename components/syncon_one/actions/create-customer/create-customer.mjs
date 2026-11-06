import syncOne from "../../syncon_one.app.mjs";

export default {
  key: "syncon_one-create-customer",
  name: "Create Customer",
  description:
    "Adds a customer in Syncon One. [See the API reference](https://synconone.com/docs/api-reference).",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: false, openWorldHint: true, readOnlyHint: false },
  props: {
    syncOne,
    display_name: { type: "string", label: "Name", description: "The name.", optional: true },
    first_name: {
      type: "string",
      label: "First name",
      description: "The first name.",
      optional: true,
    },
    last_name: {
      type: "string",
      label: "Last name",
      description: "The last name.",
      optional: true,
    },
    email: { type: "string", label: "Email", description: "The email.", optional: true },
    phone: { type: "string", label: "Phone", description: "The phone.", optional: true },
    whatsapp: { type: "string", label: "WhatsApp", description: "The whatsapp.", optional: true },
    title: { type: "string", label: "Job title", description: "The job title.", optional: true },
    department: {
      type: "string",
      label: "Department",
      description: "The department.",
      optional: true,
    },
    company: { type: "string", label: "Company", description: "The company.", optional: true },
    lifecycle_stage: {
      type: "string",
      label: "Lifecycle stage",
      description: "The lifecycle stage.",
      optional: true,
      options: ["lead", "prospect", "customer", "churned"],
    },
    lead_source: {
      type: "string",
      label: "Lead source",
      description: "The lead source.",
      optional: true,
    },
    owner: { type: "string", label: "Owner", description: "The owner.", optional: true },
    linkedin_url: {
      type: "string",
      label: "LinkedIn",
      description: "The linkedin.",
      optional: true,
    },
    city: { type: "string", label: "City", description: "The city.", optional: true },
    region: { type: "string", label: "Region", description: "The region.", optional: true },
    country: { type: "string", label: "Country", description: "The country.", optional: true },
    time_zone: {
      type: "string",
      label: "Time zone",
      description: "The time zone.",
      optional: true,
    },
    language: { type: "string", label: "Language", description: "The language.", optional: true },
    description: { type: "string", label: "About", description: "The about.", optional: true },
    do_not_contact: {
      type: "boolean",
      label: "Do not contact",
      description: "The do not contact.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    for (const key of [
      "display_name",
      "first_name",
      "last_name",
      "email",
      "phone",
      "whatsapp",
      "title",
      "department",
      "company",
      "lifecycle_stage",
      "lead_source",
      "owner",
      "linkedin_url",
      "city",
      "region",
      "country",
      "time_zone",
      "language",
      "description",
      "do_not_contact",
    ]) {
      if (this[key] !== undefined && this[key] !== "") data[key] = this[key];
    }
    const response = await this.syncOne.create({ $, path: "/people", data });
    $.export("$summary", `Created customer ${response.data?.id ?? ""}`);
    return response.data;
  },
};
