import greenhouseJobBoardApi from "../../greenhouse_job_board_api.app.mjs";

export default {
  key: "greenhouse_job_board_api-list-offices",
  name: "List Offices",
  description: "List all offices for the connected Greenhouse job board (no company or board input is needed — it always targets the connected account) via `GET /{board_token}/offices`. Use this to discover office locations or find office IDs. Returns the `offices` array, projected to a compact set of fields per office (`id`, `name`, `location`, `child_ids`) so the response fits within the size limit — the full objects embed every office's departments and their jobs, which can be tens of megabytes on a large board. Pass `fields` to include more (e.g. `departments`) or `[\"all\"]` for the raw objects. Example: calling with no inputs returns `[{ \"id\": 55, \"name\": \"US-SF-HQ\", \"location\": \"San Francisco, California, United States\", \"child_ids\": [] }, ...]`. [See the documentation](https://developers.greenhouse.io/job-board.html#list-offices).",
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
      description: "How to render the office hierarchy. `list` (default) returns a flat list with `child_ids`; `tree` returns nested `children` (pass `fields: [\"all\"]` alongside `tree` to keep the nested structure). One of: `list`, `tree`.",
    },
    fields: {
      propDefinition: [
        greenhouseJobBoardApi,
        "fields",
      ],
      description: "Which fields to return per office. Defaults to a compact set (`id`, `name`, `location`, `child_ids`). Add more (e.g. `departments`) or pass `[\"all\"]` for the raw objects — note that including `departments` embeds every office's jobs and can exceed the response size limit.",
    },
  },
  async run({ $ }) {
    const response = await this.greenhouseJobBoardApi.listOffices({
      $,
      params: {
        render_as: this.renderAs,
      },
    });
    const offices = this.greenhouseJobBoardApi.projectFields(
      response.offices,
      [
        "id",
        "name",
        "location",
        "child_ids",
      ],
      this.fields,
    );
    $.export("$summary", `Found ${response.offices.length} office(s) for board "${this.greenhouseJobBoardApi.getBoardToken()}"`);
    return offices;
  },
};
