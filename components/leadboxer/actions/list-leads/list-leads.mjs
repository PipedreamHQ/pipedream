import leadboxer from "../../leadboxer.app.mjs";

export default {
  key: "leadboxer-list-leads",
  name: "List Leads",
  description: "Retrieve a list of leads. [See the documentation](https://developers.leadboxer.com/reference/users)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    leadboxer,
    search: {
      type: "string",
      label: "Search",
      description: "Keyword or phrase to search across all searchable fields. Search is case-insensitive for text fields. Defaults to `*` to match all results.",
      optional: true,
      default: "*",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of rows to return in the response.",
      optional: true,
      default: 50,
      min: 1,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "Locale for formatting the `prettyLastEvent` field in the response. Determines the language and regional formatting (e.g., dates, text) returned by the API.",
      optional: true,
      default: "en_US",
    },
    nextToken: {
      type: "string",
      label: "Next Token",
      description: "Token returned after each request, used to fetch the next page of results. Each token is valid for 10 minutes.",
      optional: true,
    },
    criteriaTextFilter: {
      type: "string",
      label: "Criteria Text Filter",
      description: "Text-based filter expression used to filter result fields. Format: `field|operator|value`. Multiple filters are comma-separated.",
      optional: true,
    },
    criteriaNumberFilter: {
      type: "string",
      label: "Criteria Number Filter",
      description: "Numeric filter expression used to filter results based on numeric fields. Format: `field|operator|value`. Multiple filters are comma-separated. Supported numeric operators include `greaterthan`, `lessthan`, `is`, `isnot`, `between`, and `notbetween`. The `between` and `notbetween` operators use the format `min-max`.",
      optional: true,
    },
    criteriaTimeFilter: {
      type: "string",
      label: "Criteria Time Filter",
      description: "Time-based filter expression used to filter results by time field. Format: `field|operator|value`. Allowed fields (same as **Time Field**): `eventEsTimestamp` (Last Seen), `first_session_unix_timestamp` (First Seen). Supported operators: `exactly` (integer value, `0` = Today, `1` = Yesterday), `lessthan` (integer value, e.g. `6` = last 7 days), `between` (date range in format `dd/MM/yyyy-dd/MM/yyyy`). Locale settings are taken into account while interpreting dates and returning results.",
    },
    criteriaFieldFilter: {
      type: "string",
      label: "Criteria Field Filter",
      description: "Field-based filter used to include leads based on field presence. Format: `operator|field1;field2`. Allowed operator: `hasanyvalue`. Allowed fields: `firstName`, `lastName`, `email`. Multiple fields can be provided using semicolons.",
      optional: true,
    },
    criteriaExitLinkFilter: {
      type: "string",
      label: "Criteria Exit Link Filter",
      description: "Exit link filter used to include or exclude leads based on exit link values. Format: `field|operator|value`. Supported operators: `contains`, `is`, `isnot`, `doesnotcontain`. Multiple values can be provided using semicolons.",
      optional: true,
    },
    criteriaLeadscoreFilter: {
      type: "integer",
      label: "Criteria Lead Score Filter",
      description: "Minimum lead score threshold (0-100). Only records with lead scores greater than the provided number are returned.",
      optional: true,
    },
    criteriaDisplayFilter: {
      type: "string[]",
      label: "Criteria Display Filter",
      description: "Display filter used to control which types of leads are returned. Selecting `unidentified` returns leads that could not be identified as a company or a person.",
      optional: true,
      options: [
        "company",
        "person",
        "unidentified",
      ],
    },
    timeField: {
      type: "string",
      label: "Time Field",
      description: "Time field used for filtering.",
      options: [
        {
          label: "Last Seen",
          value: "eventEsTimestamp",
        },
        {
          label: "First Seen",
          value: "first_session_unix_timestamp",
        },
      ],
      default: "eventEsTimestamp",
    },
    usePresetExclusionList: {
      type: "string",
      label: "Use Preset Exclusion List",
      description: "Use a preset exclusion list of criteria to exclude from results.",
      optional: true,
      options: [
        "use_id",
        "last_most_likely_company",
        "organizationName",
        "organizationDomain",
      ],
    },
    userId: {
      type: "integer",
      label: "User ID",
      description: "The ID of the user to filter leads by.",
      optional: true,
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "Time zone used when parsing timestamps and evaluating time-based filters. If not provided, the default time zone is `Europe/Amsterdam`.",
      optional: true,
      default: "Europe/Amsterdam",
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort results by a specific field and direction. Format: `field|direction`. Allowed fields: `lastEvent`, `_score`. Allowed directions: `asc`, `desc`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.leadboxer.listLeads({
      $,
      params: {
        search: this.search,
        limit: this.limit,
        locale: this.locale,
        nextToken: this.nextToken,
        criteriaTextFilter: this.criteriaTextFilter,
        criteriaNumberFilter: this.criteriaNumberFilter,
        criteriaTimeFilter: this.criteriaTimeFilter,
        criteriaFieldFilter: this.criteriaFieldFilter,
        criteriaExitLinkFilter: this.criteriaExitLinkFilter,
        criteriaLeadscoreFilter: this.criteriaLeadscoreFilter,
        criteriaDisplayFilter: this.criteriaDisplayFilter
          ? this.criteriaDisplayFilter?.join(";")
          : undefined,
        timeField: this.timeField,
        usePresetExclusionList: this.usePresetExclusionList,
        userId: this.userId,
        timeZone: this.timeZone,
        sortBy: this.sortBy,
      },
    });

    const count = response?.data?.length;
    $.export("$summary", `Successfully retrieved ${count} lead${count === 1
      ? ""
      : "s"}.`);

    return response;
  },
};
