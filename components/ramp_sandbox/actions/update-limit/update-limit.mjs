// x-pd-ai: optimized
import ramp from "../../ramp_sandbox.app.mjs";
import updateLimit from "@pipedream/ramp/actions/update-limit/update-limit.mjs";
import constants from "@pipedream/ramp/common/constants.mjs";

export default {
  ...updateLimit,
  key: "ramp_sandbox-update-limit",
  name: "Update Limit",
  description: "Update an existing Ramp Sandbox spend limit — rename it and/or set its spending restriction. Run the **List Limits** action to find the limit ID. This is a partial update: fields you omit are left unchanged. Pass **Display Name** alone to simply rename a limit. To set a spending cap you must provide **both** an **Amount** (in minor units, e.g. `50000` for $500.00) and an **Interval** (e.g. `MONTHLY`); currency defaults to USD. [See the documentation](https://docs.ramp.com/developer-api/v1/api/funds)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ramp,
    limitId: {
      type: "string",
      label: "Limit ID",
      description: "The ID of the spend limit to update — a UUID, e.g. `dcd0f7a8-557d-4dc5-bb12-49297c3abfdd`. Run the **List Limits** action to find this value.",
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "New display name for the limit. Pass this alone to simply rename the limit.",
      optional: true,
    },
    amount: {
      type: "integer",
      label: "Limit Amount",
      description: "Maximum spend per interval, in minor units (cents) — e.g. `50000` for $500.00. Must be set together with **Interval**; currency defaults to USD.",
      optional: true,
    },
    currencyCode: {
      type: "string",
      label: "Currency Code",
      description: "ISO 4217 currency code for the limit amount, e.g. `USD` (the default when omitted).",
      optional: true,
    },
    interval: {
      type: "string",
      label: "Interval",
      description: "Spending interval for the restriction (e.g. `MONTHLY`). Must be set together with **Limit Amount**.",
      options: constants.INTERVALS,
      optional: true,
    },
  },
};
