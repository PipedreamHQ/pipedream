import givebutter from "../../givebutter.app.mjs";

export default {
  key: "givebutter-list-contacts",
  name: "List Contacts",
  description: "List contacts/donors from the authenticated Givebutter account. Returns a paginated array of contact objects (each includes at minimum `id`, `primary_email`, `first_name`, and `last_name`). Note that the API returns only `individual` contacts unless **Type** is set to `company`. Use this to discover contact IDs before calling **Update Contact**. [See the documentation](https://docs.givebutter.com/api-reference/contacts/list-all-contacts)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    givebutter,
    type: {
      propDefinition: [
        givebutter,
        "contactType",
      ],
      description: "Contact type to list. The Givebutter API defaults to `individual`, so company contacts are omitted unless this is explicitly set to `company`.",
    },
    email: {
      propDefinition: [
        givebutter,
        "email",
      ],
      description: "Optional exact email to filter contacts by (maps to the API `email` query param). Example: `jane@example.com`.",
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Optional field to sort by.",
      options: [
        "name_or_company",
        "primary_email",
        "point_of_contact",
        "created_at",
        "total_contributions",
        "recurring_contributions",
        "last_donation_amount",
      ],
      optional: true,
    },
    page: {
      propDefinition: [
        givebutter,
        "page",
      ],
    },
    limit: {
      propDefinition: [
        givebutter,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.givebutter.listContacts({
      $,
      params: {
        type: this.type,
        email: this.email,
        sortBy: this.sortBy,
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
