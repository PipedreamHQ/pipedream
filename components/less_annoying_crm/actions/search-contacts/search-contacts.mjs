import app from "../../less_annoying_crm.app.mjs";
import {
  parseJson, contactSummaryName, pluck,
} from "../../common/utils.mjs";

const DEFAULT_FIELDS = [
  "ContactId",
  "IsCompany",
  "Name",
  "Company Name",
  "Job Title",
  "Email",
  "Phone",
  "AssignedTo",
  "LastUpdate",
];

export default {
  key: "less_annoying_crm-search-contacts",
  name: "Search Contacts",
  description: "Searches contacts and companies in Less Annoying CRM by free text (name, email, phone, etc.), with optional filters for record type, owner, and sorting. With no search terms it lists records."
    + " Use this to find a `contactId` before calling **Get Contact**, **Get Contact Activities**, **Update Contact**, **Create Note**, **Create Task**, or **Create Pipeline Item**."
    + " For \"my contacts\", get the user ID from **List Users** and pass it in `ownerIds`."
    + " `advancedFilters` is an optional JSON array of `{\"Name\": field, \"Operation\": op, \"Value\": value}` objects; see the [filter docs](https://account.lessannoyingcrm.com/api_docs/v2/Advanced/Filter_Contacts) for valid operations."
    + " Returns `results` plus `hasMoreResults`; if true, call again with `page` incremented."
    + " Each result is trimmed to ContactId, IsCompany, Name, Company Name, Job Title, Email, Phone, AssignedTo, and LastUpdate; pass `fields` (e.g. `[\"Address\", \"Background Info\"]`) to get other fields too, or use **Get Contact** for the full record."
    + " Example: `searchTerms: \"jane@acme.com\"` returns `{\"hasMoreResults\": false, \"results\": [{\"ContactId\": \"1234567890123456789012345678901\", \"IsCompany\": false, \"Name\": {\"FirstName\": \"Jane\", \"LastName\": \"Smith\"}, \"Email\": [{\"Text\": \"jane@acme.com\", \"Type\": \"Work\"}], ...}]}`."
    + " [See the documentation](https://account.lessannoyingcrm.com/api_docs/v2/Core_Functions/Contacts#Goto-GetContacts)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    searchTerms: {
      type: "string",
      label: "Search Terms",
      description: "Text to match against contact/company fields, e.g. `Jane Smith` or `jane@acme.com`.",
      optional: true,
    },
    recordType: {
      type: "string",
      label: "Record Type",
      description: "Limit results to people or companies, e.g. `Companies`. Omit for both.",
      options: [
        "Contacts",
        "Companies",
      ],
      optional: true,
    },
    ownerIds: {
      propDefinition: [
        app,
        "ownerUserIds",
      ],
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Field to sort results by, e.g. `LastUpdate`. Defaults to `Relevance`.",
      options: [
        "Relevance",
        "FirstName",
        "LastName",
        "CompanyName",
        "DateCreated",
        "LastUpdate",
      ],
      optional: true,
    },
    sortDirection: {
      propDefinition: [
        app,
        "sortDirection",
      ],
      description: "Sort order, e.g. `Ascending`. Defaults to `Descending`.",
    },
    advancedFilters: {
      propDefinition: [
        app,
        "advancedFilters",
      ],
    },
    fields: {
      type: "string[]",
      label: "Extra Fields",
      description: "Additional record fields to include beyond the default set, e.g. `[\"Address\", \"Background Info\", \"Website\", \"DateCreated\"]`. Custom field names are also accepted.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const {
      HasMoreResults, Results,
    } = await this.app.getContacts({
      $,
      parameters: {
        SearchTerms: this.searchTerms,
        RecordTypeFilter: this.recordType,
        OwnerFilter: this.ownerIds,
        SortBy: this.sortBy,
        SortDirection: this.sortDirection,
        AdvancedFilters: parseJson(this.advancedFilters, "Advanced Filters"),
        MaxNumberOfResults: this.maxResults ?? 50,
        Page: this.page,
      },
    });

    const names = Results.slice(0, 3).map(contactSummaryName)
      .join(", ");
    $.export("$summary", `Found ${Results.length} record(s)${Results.length
      ? `: ${names}${Results.length > 3
        ? ", ..."
        : ""}`
      : ""}`);
    const fields = [
      ...DEFAULT_FIELDS,
      ...(this.fields ?? []),
    ];
    return {
      hasMoreResults: HasMoreResults,
      results: Results.map((record) => pluck(record, fields)),
    };
  },
};
