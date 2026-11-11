import pipedriveApp from "../../pipedrive.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "pipedrive-list-filters",
  name: "List Filters",
  description: "List filters in your Pipedrive account, optionally scoped to a single entity type. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Filters#getFilters)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pipedriveApp,
    type: {
      type: "string",
      label: "Type",
      description: "The entity type to filter by. When omitted, filters of every type are returned.",
      options: constants.FILTER_TYPE_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.getFilters({
      type: this.type,
    });
    $.export("$summary", `Successfully listed ${response.data?.length ?? 0} filter(s)`);
    return response;
  },
};
