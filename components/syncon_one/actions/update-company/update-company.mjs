import syncOne from "../../syncon_one.app.mjs";

export default {
  key: "syncon_one-update-company",
  name: "Update Company",
  description: "Changes a company in Syncon One. Only the fields you fill in are changed.",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: false, openWorldHint: true, readOnlyHint: false },
  props: {
    syncOne,
    id: {
      type: "string",
      label: "Company ID",
      description: "The id of the company, from an earlier step or a search.",
    },
    name: { type: "string", label: "Name", description: "The name.", optional: true },
    domain: { type: "string", label: "Domain", description: "The domain.", optional: true },
    website: { type: "string", label: "Website", description: "The website.", optional: true },
    industry: { type: "string", label: "Industry", description: "The industry.", optional: true },
    employee_count: {
      type: "integer",
      label: "Employees",
      description: "The employees.",
      optional: true,
    },
    annual_revenue_cents: {
      type: "integer",
      label: "Annual revenue",
      description: "The annual revenue.",
      optional: true,
    },
    phone: { type: "string", label: "Phone", description: "The phone.", optional: true },
    lifecycle_stage: {
      type: "string",
      label: "Lifecycle stage",
      description: "The lifecycle stage.",
      optional: true,
      options: ["lead", "prospect", "customer", "churned"],
    },
    tier: { type: "string", label: "Tier", description: "The tier.", optional: true },
    source: { type: "string", label: "Source", description: "The source.", optional: true },
    owner: { type: "string", label: "Owner", description: "The owner.", optional: true },
    address_line: { type: "string", label: "Address", description: "The address.", optional: true },
    city: { type: "string", label: "City", description: "The city.", optional: true },
    region: { type: "string", label: "Region", description: "The region.", optional: true },
    country: { type: "string", label: "Country", description: "The country.", optional: true },
    time_zone: {
      type: "string",
      label: "Time zone",
      description: "The time zone.",
      optional: true,
    },
    description: { type: "string", label: "About", description: "The about.", optional: true },
  },
  async run({ $ }) {
    const data = {};
    for (const key of [
      "name",
      "domain",
      "website",
      "industry",
      "employee_count",
      "annual_revenue_cents",
      "phone",
      "lifecycle_stage",
      "tier",
      "source",
      "owner",
      "address_line",
      "city",
      "region",
      "country",
      "time_zone",
      "description",
    ]) {
      if (this[key] !== undefined && this[key] !== "") data[key] = this[key];
    }
    const response = await this.syncOne.update({ $, path: "/companies", id: this.id, data });
    $.export("$summary", `Updated company ${this.id}`);
    return response.data;
  },
};
