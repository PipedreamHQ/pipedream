import { ConfigurationError } from "@pipedream/platform";
import wealthbox from "../../wealthbox.app.mjs";

const PER_PAGE = 25;
const MAX_PAGES = 40; // cap at 1,000 contacts (40 × 25)

export default {
  key: "wealthbox-find-contact",
  name: "Find Contact",
  description: "Search Wealthbox contacts by name, email, and/or phone. Automatically paginates through all result pages (capped at 1,000 contacts total). At least one search parameter is required. Example: search `name='Jane Smith'`; returns contact objects each including `id`, `first_name`, `last_name`, `email_addresses`, `phone_numbers`, `type`, and `contact_type`. Supply the optional Fields parameter (e.g. `[\"id\",\"first_name\",\"last_name\"]`) to receive a trimmed response. [See the documentation](https://dev.wealthbox.com/#contacts-retrieve-all-contacts-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    wealthbox,
    name: {
      type: "string",
      label: "Contact Name",
      description: "Partial or full name to search. Matches prefix, first, middle, last, suffix, nickname, and full name (including household/company/trust names). Example: `Jane Smith`.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address to search for. Example: `jane@acme.com`.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number to search for.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in each returned contact object. When omitted, all fields are returned. Example: `[\"id\", \"first_name\", \"last_name\", \"email_addresses\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.name && !this.email && !this.phone) {
      throw new ConfigurationError("At least one of Name, Email, or Phone is required.");
    }

    const contacts = [];
    let page = 1;

    while (page <= MAX_PAGES) {
      const response = await this.wealthbox.listContacts({
        $,
        params: {
          name: this.name,
          page,
          per_page: PER_PAGE,
        },
      });
      const batch = response?.contacts || [];
      contacts.push(...batch);
      if (batch.length < PER_PAGE) break;
      page++;
    }

    // The Wealthbox API stores emails and phones as nested arrays
    // (email_addresses[].address, phone_numbers[].address) — filter client-side.
    let filtered = contacts;
    if (this.email) {
      const emailLower = this.email.toLowerCase();
      filtered = filtered.filter((c) =>
        c.email_addresses?.some((e) => e.address?.toLowerCase() === emailLower));
    }
    if (this.phone) {
      filtered = filtered.filter((c) =>
        c.phone_numbers?.some((p) => p.address === this.phone));
    }

    const result = this.fields?.length
      ? filtered.map((c) => Object.fromEntries(this.fields.map((f) => [
        f,
        c[f],
      ])))
      : filtered;

    $.export("$summary", `Found ${result.length} contact${result.length === 1
      ? ""
      : "s"} matching the search criteria`);
    return result;
  },
};
