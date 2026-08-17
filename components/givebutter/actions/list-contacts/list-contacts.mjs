// x-pd-ai: optimized
import givebutter from "../../givebutter.app.mjs";
import {
  CONTACT_SORT_BY,
  CONTACT_TYPES,
  MAX_PER_PAGE,
} from "../common/constants.mjs";

export default {
  key: "givebutter-list-contacts",
  name: "List Contacts",
  description: "List contacts/donors from the authenticated Givebutter account. Calls GET /contacts and returns the paginated array of contact objects (each includes at minimum `id`, `primary_email`, `first_name`, and `last_name`). Note that the API returns only `individual` contacts unless **Type** is set to `company`. Use this to discover contact IDs before calling **Update Contact**. [See the documentation](https://docs.givebutter.com/api-reference/contacts/list-all-contacts)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    givebutter,
    type: {
      type: "string",
      label: "Type",
      description: `Contact type to list. One of: ${CONTACT_TYPES.map((t) => `\`${t}\``).join(", ")}. The Givebutter API defaults to \`individual\`, so company contacts are omitted unless this is explicitly set to \`company\`.`,
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Optional exact email to filter contacts by (maps to the API `email` query param). Example: `jane@example.com`.",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: `Optional field to sort by. One of: ${CONTACT_SORT_BY.map((s) => `\`${s}\``).join(", ")}.`,
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "1-indexed page number for offset-based pagination (Givebutter default: 1).",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of contacts to return per page (maps to \`per_page\`). Must be between 1 and ${MAX_PER_PAGE} (the Givebutter API caps \`per_page\` at ${MAX_PER_PAGE}). Defaults to the API default of 20 if omitted.`,
      min: 1,
      max: MAX_PER_PAGE,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.givebutter.listContacts({
      $,
      params: {
        type: this.type,
        email: this.email,
        sort_by: this.sortBy,
        page: this.page,
        per_page: this.limit,
      },
    });
    const contacts = response?.data ?? response;
    const count = Array.isArray(contacts)
      ? contacts.length
      : "unknown number of";
    $.export("$summary", `Retrieved ${count} contact(s)`);
    return response;
  },
};
