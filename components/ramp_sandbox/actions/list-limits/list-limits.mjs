import ramp from "../../ramp_sandbox.app.mjs";
import listLimits from "@pipedream/ramp/actions/list-limits/list-limits.mjs";

export default {
  ...listLimits,
  key: "ramp_sandbox-list-limits",
  name: "List Limits",
  description: "Retrieve a paginated list of Ramp Sandbox spend limits. Returns a compact summary of each limit by default (id, display_name, state, balance, spend_program_id, created_at, is_shareable); use **Get Limit** for the full record, or pass `fields` to include specific extra fields. Use this to find limit IDs for **Get Limit**, **Update Limit**, and **Terminate Limit**. Returns one page of up to `pageSize` results (max 100); a `page.next` value in the response means more limits exist beyond this page. [See the documentation](https://docs.ramp.com/developer-api/v1/api/funds)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    ramp,
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
      description: "Optional list of limit fields to include per record in addition to the compact default (e.g. `cards`, `members`, `spending_restrictions`, `permitted_spend_types`). Leave empty for the compact summary; use **Get Limit** for the complete record.",
    },
  },
};
