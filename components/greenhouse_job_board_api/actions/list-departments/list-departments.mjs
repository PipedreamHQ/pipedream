import greenhouseJobBoardApi from "../../greenhouse_job_board_api.app.mjs";

export default {
  key: "greenhouse_job_board_api-list-departments",
  name: "List Departments",
  description: "List departments for the connected Greenhouse job board (no company or board input is needed — it always targets the connected account) via `GET /{board_token}/departments`. Use this to map a company's org structure or find department IDs. Returns `{ total_count, returned_count, note, departments }`: the `departments` array is capped at `limit` (default 25) and projected to a compact set of fields per department (`id`, `name`, `parent_id`) so large boards (over a thousand departments) fit within the response size limit — the full objects embed every department's jobs, which is what would overflow. `total_count` reports how many exist and `note` appears when results were truncated. Pass `fields` to include more (e.g. `child_ids`, `jobs`) or `[\"all\"]` for the raw objects, and `limit` to return more rows. Example: calling with no inputs returns `{ \"total_count\": 1022, \"returned_count\": 25, \"note\": \"Showing the first 25 of 1022 departments...\", \"departments\": [{ \"id\": 101, \"name\": \"Engineering\", \"parent_id\": null }, ...] }`. [See the documentation](https://developers.greenhouse.io/job-board.html#list-departments).",
  version: "0.0.1",
  ai: "optimized",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    greenhouseJobBoardApi,
    renderAs: {
      propDefinition: [
        greenhouseJobBoardApi,
        "renderAs",
      ],
      description: "How to render the department hierarchy. `list` (default) returns a flat list with `child_ids`; `tree` returns nested `children` (pass `fields: [\"all\"]` alongside `tree` to keep the nested structure). One of: `list`, `tree`.",
    },
    fields: {
      propDefinition: [
        greenhouseJobBoardApi,
        "fields",
      ],
      description: "Which fields to return per department. Defaults to a compact set (`id`, `name`, `parent_id`). Add more (e.g. `child_ids`, `jobs`) or pass `[\"all\"]` for the raw objects — note that including `jobs` can exceed the response size limit on large boards.",
    },
    limit: {
      propDefinition: [
        greenhouseJobBoardApi,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.greenhouseJobBoardApi.listDepartments({
      $,
      params: {
        render_as: this.renderAs,
      },
    });
    const result = this.greenhouseJobBoardApi.buildListResponse({
      items: response.departments,
      key: "departments",
      defaultFields: [
        "id",
        "name",
        "parent_id",
      ],
      fields: this.fields,
      limit: this.limit,
    });
    $.export("$summary", `Returning ${result.returned_count} of ${result.total_count} department(s) for board "${this.greenhouseJobBoardApi.getBoardToken()}"`);
    return result;
  },
};
