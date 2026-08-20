import ramp from "../../ramp.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "ramp-list-transactions",
  name: "List Transactions",
  description: "Retrieve a paginated list of Ramp transactions, optionally filtered by department, location, or state. Returns a compact summary of each transaction by default (id, merchant, amount, category, card, date); use **Get Transaction** for the full record, or pass `fields` to include specific extra fields. Use this to find transaction IDs for **Get Transaction**. Returns one page of up to `pageSize` results (max 100); a `page.next` value in the response means more transactions exist beyond this page. [See the documentation](https://docs.ramp.com/developer-api/v1/api/transactions#get-developer-v1-transactions).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ramp,
    departmentId: {
      type: "string",
      label: "Department ID",
      description: "Filter by department ID. Run the **List Departments** action to find valid IDs.",
      optional: true,
    },
    locationId: {
      type: "string",
      label: "Location ID",
      description: "Filter by location ID. Run the **List Locations** action to find valid IDs.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "Filter by transaction state.",
      options: constants.TRANSACTION_STATES,
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of results per page, between 2 and 100 (default 20).",
      min: 2,
      max: 100,
      optional: true,
    },
    start: {
      type: "string",
      label: "Start (Pagination Cursor)",
      description: "Pagination cursor for the next page. Take the `start` query-parameter value from the previous response's `page.next` URL and pass it here.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of transaction fields to include per record in addition to the compact default (e.g. `line_items`, `disputes`, `card_holder`). Leave empty for the compact summary; use **Get Transaction** for the complete record.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ramp.listTransactions({
      $,
      params: {
        department_id: this.departmentId,
        location_id: this.locationId,
        state: this.state,
        page_size: this.pageSize,
        start: this.start,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} transaction(s)`);
    return utils.projectList(response, utils.TRANSACTION_COMPACT_FIELDS, this.fields);
  },
};
