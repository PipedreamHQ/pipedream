import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-list-pipelines",
  name: "List Pipelines",
  description: "Lists the deal pipelines in your Pipedrive account, returning each pipeline's `id`, `name` and `order_nr`."
    + " Use the returned `id` as the `Pipeline ID` in **Add Deal**, **Update Deal** or **List Deals**, and pass it to **List Stages** to get the stages of that pipeline."
    + " Results are paginated: when `additional_data.next_cursor` is present, call again with it as `Cursor` to fetch the next page."
    + " [See the documentation](https://developers.pipedrive.com/docs/api/v1/Pipelines#getPipelines)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pipedriveApp,
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of pipelines to return per page, e.g. `50`. Defaults to `100`; maximum `500`.",
      min: 1,
      max: 500,
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "The cursor for the next page of results, an opaque string copied verbatim from `additional_data.next_cursor` of the previous call. Omit to fetch the first page.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.getPipelines({
      limit: this.limit,
      cursor: this.cursor,
    });
    const count = response.data?.length ?? 0;
    $.export("$summary", `Successfully listed ${count} pipeline${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
