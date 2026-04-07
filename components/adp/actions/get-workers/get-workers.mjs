import adp from "../../adp.app.mjs";

export default {
  key: "adp-get-workers",
  name: "Get Workers",
  description: "Returns a list of workers (active employees) from ADP. Uses the `/hr/v2/workers` endpoint. [See docs](https://developers.adp.com/apis/api-explorer/hcm-offrg-wfn/hcm-offrg-wfn-hr-workers-v2-workers)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    adp,
    filter: {
      type: "string",
      label: "Filter",
      description: "OData filter expression to narrow results (e.g. `workers/workAssignments/assignmentStatus/statusCode/codeValue eq 'A'` for active workers).",
      optional: true,
    },
    top: {
      type: "integer",
      label: "Top (Limit)",
      description: "Maximum number of workers to return.",
      optional: true,
    },
    skip: {
      type: "integer",
      label: "Skip (Offset)",
      description: "Number of workers to skip for pagination.",
      optional: true,
    },
    select: {
      type: "string",
      label: "Select Fields",
      description: "Comma-separated list of fields to return (e.g. `workers/associateOID,workers/person/legalName`).",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.filter) params["$filter"] = this.filter;
    if (this.top) params["$top"] = this.top;
    if (this.skip) params["$skip"] = this.skip;
    if (this.select) params["$select"] = this.select;

    const response = await this.adp.getWorkers({
      $,
      params: Object.keys(params).length
        ? params
        : undefined,
    });

    const workers = response?.workers ?? [];
    const n = workers.length;
    const suffix = n === 1
      ? ""
      : "s";
    $.export("$summary", `Successfully retrieved ${n} worker${suffix}`);
    return response;
  },
};
