// x-pd-ai: optimized
import wealthbox from "../../wealthbox.app.mjs";
import {
  DEFAULT_LIST_LIMIT,
  MAX_LIST_LIMIT,
} from "../../common/constants.mjs";

const PER_PAGE = 25;
const MAX_API_PAGES = 40; // fetch up to 1,000 contacts to find enough households

export default {
  key: "wealthbox-list-households",
  name: "List Households",
  description: "Companion list action for the free-form Household id prop. Returns household-type contacts via GET /contacts so agents/users can discover valid household ids for **Add Member To Household**. Paginates automatically up to the requested Limit. Example: returns household objects each including `id`, `name`, `type`, `email_addresses`, and `phone_numbers`. Supply the optional Fields parameter (e.g. `[\"id\",\"name\"]`) to receive a trimmed response. [See the documentation](https://dev.wealthbox.com/#contacts-retrieve-all-contacts-get)",
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
      label: "Household Name",
      description: "Optional partial household name to filter by. Example: `Smith Family`.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of households to return (1-${MAX_LIST_LIMIT}). Defaults to ${DEFAULT_LIST_LIMIT}.`,
      min: 1,
      max: MAX_LIST_LIMIT,
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in each returned household object. When omitted, all fields are returned. Example: `[\"id\", \"name\", \"email_addresses\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const limit = this.limit || DEFAULT_LIST_LIMIT;
    const households = [];
    let page = 1;

    while (households.length < limit && page <= MAX_API_PAGES) {
      const response = await this.wealthbox.listHouseholds({
        $,
        params: {
          name: this.name,
          per_page: PER_PAGE,
          page,
        },
      });
      const batch = response?.contacts || [];
      // Client-side filter to Household type — the API `type` query param is
      // undocumented for GET /contacts and may be silently ignored.
      const householdBatch = batch.filter((c) => c.type === "Household");
      households.push(...householdBatch);
      if (batch.length < PER_PAGE) break; // no more pages
      page++;
    }

    const sliced = households.slice(0, limit);
    const result = this.fields?.length
      ? sliced.map((h) => Object.fromEntries(this.fields.map((f) => [
        f,
        h[f],
      ])))
      : sliced;

    $.export("$summary", `Found ${result.length} household${result.length === 1
      ? ""
      : "s"}`);
    return result;
  },
};
