import app from "../../apollo_io.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "apollo_io-search-contacts",
  name: "Search For Contacts",
  description: "Search for contacts in Apollo.io. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#search-for-contacts)",
  type: "action",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    search: {
      type: "string",
      label: "Search",
      description: "The contact's name, title, company, or email",
    },
    contactStageId: {
      propDefinition: [
        app,
        "contactStageId",
      ],
      type: "string[]",
      optional: true,
    },
    sortByField: {
      type: "string",
      label: "Sort By Field",
      description: "The field to sort the response.",
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
      description: "The order to be applied to the sort.",
      optional: true,
    },
  },
  async run({ $ }) {
    const resourcesStream = this.app.getIterations({
      resourceFn: this.app.searchContacts,
      resourceFnArgs: {
        params: {
          q_keywords: this.search,
          contact_stage_ids: this.contactStageId,
          sort_by_field: this.sortByField,
          sort_ascending: this.sortAscending,
        },
      },
      resourceName: "contacts",
    });

    const contacts = await utils.iterate(resourcesStream);

    $.export("$summary", `Successfully fetched ${contacts.length} contacts.`);

    return contacts;

  },
};
