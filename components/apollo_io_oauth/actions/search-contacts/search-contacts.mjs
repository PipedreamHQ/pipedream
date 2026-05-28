import app from "../../apollo_io_oauth.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "apollo_io_oauth-search-contacts",
  name: "Search Contacts",
  description:
    "Searches for contacts in your Apollo CRM by keyword, stage,"
    + " or sort criteria. Returns contact name, email, title,"
    + " company, and stage."
    + " Use this to find contacts before updating them with"
    + " **Create or Update Contact** or enrolling them with"
    + " **Add Contacts to Sequence**."
    + " The `query` parameter searches across name, title,"
    + " company, and email."
    + " [See the documentation](https://docs.apollo.io/reference"
    + "/search-for-contacts)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description:
        "Search keyword matching contact name, title, company,"
        + " or email. Example: `\"John\"` or `\"acme.com\"`.",
      optional: true,
    },
    contactStageIds: {
      type: "string[]",
      label: "Contact Stage IDs",
      description:
        "Filter by one or more contact stage IDs."
        + " Use **List Metadata** (type `contact_stages`) to"
        + " discover valid stage IDs.",
      optional: true,
    },
    sortByField: {
      type: "string",
      label: "Sort By Field",
      description: "The field to sort results by.",
      options: [
        "contact_last_activity_date",
        "contact_email_last_opened_at",
        "contact_email_last_clicked_at",
        "contact_created_at",
        "contact_updated_at",
      ],
      optional: true,
    },
    sortAscending: {
      type: "boolean",
      label: "Sort Ascending",
      description:
        "Set to `true` for ascending order, `false` for"
        + " descending. Defaults to descending.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description:
        "Maximum number of contacts to return. Defaults to 100."
        + " Max 600.",
      optional: true,
    },
  },
  async run({ $ }) {
    const resourcesStream = this.app.getIterations({
      resourceFn: this.app.searchContacts,
      resourceFnArgs: {
        params: {
          q_keywords: this.query,
          contact_stage_ids: this.contactStageIds,
          sort_by_field: this.sortByField,
          sort_ascending: this.sortAscending,
        },
      },
      resourceName: "contacts",
      max: this.maxResults ?? undefined,
    });

    const contacts = await utils.iterate(resourcesStream);

    $.export(
      "$summary",
      `Found ${contacts.length} contact${contacts.length === 1
        ? ""
        : "s"}`,
    );

    return contacts;
  },
};
