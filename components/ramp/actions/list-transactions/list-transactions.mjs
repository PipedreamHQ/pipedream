import ramp from "../../ramp.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "ramp-list-transactions",
  name: "List Transactions",
  description: "Retrieve a paginated list of Ramp transactions, optionally filtered by department, location, or state. Returns a compact summary of each transaction by default (id, merchant_name, amount, merchant_amount, sk_category_name, state, card_id, limit_id, accounting_date, user_transaction_time, memo); use **Get Transaction** for the full record, or pass `fields` to include specific extra fields. Use this to find transaction IDs for **Get Transaction**. Returns one page of up to `pageSize` results (max 100); a `page.next` value in the response means more transactions exist beyond this page. [See the documentation](https://docs.ramp.com/developer-api/v1/api/transactions#get-developer-v1-transactions)",
  version: "0.0.3",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ramp,
    departmentId: {
      propDefinition: [
        ramp,
        "departmentId",
      ],
      description: "Filter by department ID — a Ramp UUID, e.g. `fffe6c22-698f-4dc5-b2b1-b35f86947d90`. Run the **List Departments** action to find valid IDs.",
    },
    locationId: {
      propDefinition: [
        ramp,
        "locationId",
      ],
      description: "Filter by location ID — a Ramp UUID, e.g. `961c6f01-5719-4f4c-8fef-4096a031f32a`. Run the **List Locations** action to find valid IDs.",
    },
    state: {
      type: "string",
      label: "State",
      description: "Filter by transaction state.",
      options: constants.TRANSACTION_STATES,
      optional: true,
    },
    pageSize: {
      propDefinition: [
        ramp,
        "pageSize",
      ],
    },
    start: {
      propDefinition: [
        ramp,
        "start",
      ],
    },
    fields: {
      propDefinition: [
        ramp,
        "fields",
      ],
      description: "Optional list of transaction fields to include per record in addition to the compact default (e.g. `line_items`, `disputes`, `card_holder`). Leave empty for the compact summary; use **Get Transaction** for the complete record.",
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
