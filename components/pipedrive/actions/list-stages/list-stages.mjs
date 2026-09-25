import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-list-stages",
  name: "List Stages",
  description: "Lists deal pipeline stages, returning each stage's `id`, `name`, `pipeline_id`, `order_nr` and `deal_probability`."
    + " Use the returned `id` as the `Stage ID` in **Add Deal**, **Update Deal** or **List Deals**."
    + " Pass a `Pipeline ID` (from **List Pipelines**) to return only that pipeline's stages; otherwise stages from all pipelines are returned, so check `pipeline_id` before picking one."
    + " Results are paginated: when `additional_data.next_cursor` is present, call again with it as `Cursor` to fetch the next page."
    + " [See the documentation](https://developers.pipedrive.com/docs/api/v1/Stages#getStages)",
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
    pipelineId: {
      propDefinition: [
        pipedriveApp,
        "pipelineId",
      ],
      description: "Only return stages belonging to this pipeline, e.g. `1`. Use **List Pipelines** to find it (the `id` field). Omit to list stages from all pipelines.",
    },
    limit: {
      propDefinition: [
        pipedriveApp,
        "limit",
      ],
    },
    cursor: {
      propDefinition: [
        pipedriveApp,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.getStages({
      pipeline_id: this.pipelineId,
      limit: this.limit,
      cursor: this.cursor,
    });
    const count = response.data?.length ?? 0;
    $.export("$summary", `Successfully listed ${count} stage${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
