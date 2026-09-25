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
