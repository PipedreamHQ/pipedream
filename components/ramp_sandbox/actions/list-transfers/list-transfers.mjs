// x-pd-ai: optimized
import ramp from "../../ramp_sandbox.app.mjs";
import listTransfers from "../../../ramp/actions/list-transfers/list-transfers.mjs";
import constants from "../../../ramp/common/constants.mjs";

export default {
  ...listTransfers,
  key: "ramp_sandbox-list-transfers",
  name: "List Transfers",
  description: "Retrieve a list of Ramp Sandbox transfers, optionally filtered by status. Example: pass Status `ACH_CONFIRMED` to return only confirmed transfers, each with amount and status. Returns one page of up to `pageSize` results (max 100); a `page.next` value in the response means more transfers exist beyond this page. [See the documentation](https://docs.ramp.com/developer-api/v1/api/transfers#get-developer-v1-transfers).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ramp,
    status: {
      type: "string",
      label: "Status",
      description: "Filter by transfer status.",
      options: constants.TRANSFER_STATUSES,
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
  },
};
