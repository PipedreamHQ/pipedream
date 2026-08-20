import ramp from "../../ramp.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "ramp-list-limits",
  name: "List Limits",
  description: "Retrieve a paginated list of Ramp spend limits. Returns a compact summary of each limit by default (id, name, state, balance, spend program); use **Get Limit** for the full record, or pass `fields` to include specific extra fields. Use this to find limit IDs for **Get Limit**, **Update Limit**, and **Terminate Limit**. Returns one page of up to `pageSize` results (max 100); a `page.next` value in the response means more limits exist beyond this page. [See the documentation](https://docs.ramp.com/developer-api/v1/api/funds).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ramp,
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of results per page, between 2 and 100 (default 20).",
      min: 2,
      max: 100,
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of limit fields to include per record in addition to the compact default (e.g. `cards`, `users`, `restrictions`, `permitted_spend_types`). Leave empty for the compact summary; use **Get Limit** for the complete record.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ramp.listLimits({
      $,
      params: {
        page_size: this.pageSize,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} limit(s)`);
    return utils.projectList(response, utils.LIMIT_COMPACT_FIELDS, this.fields);
  },
};
