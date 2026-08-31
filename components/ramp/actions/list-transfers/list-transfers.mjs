// x-pd-ai: optimized
import ramp from "../../ramp.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "ramp-list-transfers",
  name: "List Transfers",
  description: "Retrieve a list of Ramp transfers, optionally filtered by status. Example: pass Status `ACH_CONFIRMED` to return only confirmed transfers, each with amount and status. Returns one page of up to `pageSize` results (max 100); a `page.next` value in the response means more transfers exist beyond this page. [See the documentation](https://docs.ramp.com/developer-api/v1/api/transfers#get-developer-v1-transfers)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
  async run({ $ }) {
    const response = await this.ramp.listTransfers({
      $,
      params: {
        status: this.status,
        page_size: this.pageSize,
        start: this.start,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} transfer(s)`);
    return response;
  },
};
