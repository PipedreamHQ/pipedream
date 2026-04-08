import adp from "../../adp.app.mjs";

export default {
  key: "adp-get-workers",
  name: "Get Workers",
  description: "Returns a list of workers (active employees) from ADP. Uses the `/hr/v2/workers` endpoint. [See docs](https://developers.adp.com/apis/api-explorer/hcm-offrg-wfn/hcm-offrg-wfn-hr-workers-v2-workers)",
  version: "0.0.4",
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
    retrieveAllWorkers: {
      type: "boolean",
      label: "Retrieve All Workers",
      description:
        "Fetch every page using OData `$top` / `$skip` until a short or empty page. " +
        "Uses **Top (Limit)** as the page size, or 100 if unset. **Skip** applies only to the first request.",
      optional: true,
      default: false,
    },
    maxResults: {
      type: "integer",
      label: "Max Results (when retrieving all)",
      description:
        "When **Retrieve All Workers** is on, stop after this many workers. Omit for no cap (large orgs may hit step limits).",
      optional: true,
    },
  },
  async run({ $ }) {
    const baseEntries = Object.entries({
      $filter: this.filter,
      $select: this.select,
    }).filter(([
      , v,
    ]) => v !== undefined);

    if (this.retrieveAllWorkers) {
      const pageSize = this.top ?? 100;
      let skip = this.skip ?? 0;
      const cap = this.maxResults;
      const allWorkers = [];
      let firstResponse = null;

      while (true) {
        const params = Object.fromEntries([
          ...baseEntries,
          [
            "$top",
            pageSize,
          ],
          [
            "$skip",
            skip,
          ],
        ]);
        const response = await this.adp.getWorkers({
          $,
          params,
        });
        if (!firstResponse) firstResponse = response;

        const batch = this.adp.workersArrayFromResponse(response);
        const room = cap != null
          ? cap - allWorkers.length
          : null;
        const slice =
          room != null && room < batch.length
            ? batch.slice(0, room)
            : batch;
        allWorkers.push(...slice);

        const hitCap = cap != null && allWorkers.length >= cap;
        if (batch.length < pageSize || batch.length === 0 || hitCap) {
          break;
        }
        skip += batch.length;
      }

      const merged =
        firstResponse && typeof firstResponse === "object"
          ? {
            ...firstResponse,
            workers: allWorkers,
          }
          : {
            workers: allWorkers,
          };
      const n = allWorkers.length;
      const suffix = n === 1
        ? ""
        : "s";
      $.export("$summary", `Successfully retrieved ${n} worker${suffix}`);
      return merged;
    }

    const params = Object.fromEntries(
      Object.entries({
        $filter: this.filter,
        $top: this.top,
        $skip: this.skip,
        $select: this.select,
      }).filter(([
        , v,
      ]) => v !== undefined),
    );

    const response = await this.adp.getWorkers({
      $,
      params,
    });

    const workers = this.adp.workersArrayFromResponse(response);
    const n = workers.length;
    const suffix = n === 1
      ? ""
      : "s";
    $.export("$summary", `Successfully retrieved ${n} worker${suffix}`);
    return response;
  },
};
