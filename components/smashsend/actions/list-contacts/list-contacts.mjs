import smashsend from "../../smashsend.app.mjs";

export default {
  key: "smashsend-list-contacts",
  name: "List Contacts",
  description: "List all contacts. [See the documentation](https://smashsend.com/docs/api/contacts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    smashsend,
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort order: “createdAt.desc” or “createdAt.asc” (default: “createdAt.desc”)",
      options: [
        "createdAt.desc",
        "createdAt.asc",
      ],
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "Search for contacts by name, email, or phone number",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter contacts by status",
      options: [
        "SUBSCRIBED",
        "UNSUBSCRIBED",
        "BANNED",
      ],
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const contacts = await this.smashsend.getPaginatedResources({
      fn: this.smashsend.listContacts,
      params: {
        sort: this.sort,
        search: this.search,
        status: this.status,
      },
      resourceKey: "contacts",
      max: this.maxResults,
    });
    $.export("$summary", `Successfully fetched ${contacts.length} contact${contacts.length === 1
      ? ""
      : "s"}`);
    return contacts;
  },
};
