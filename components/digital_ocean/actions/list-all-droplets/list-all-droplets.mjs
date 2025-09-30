import digitalOceanApp from "../../digital_ocean.app.mjs";
import digitalOceanConstants from "../../common/constants.mjs";

export default {
  key: "digital_ocean-list-all-droplets",
  name: "List all Droplets",
  description: "List all Droplets. [See the docs here](https://docs.digitalocean.com/reference/api/api-reference/#operation/list_all_droplets)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    digitalOceanApp,
    includeAll: {
      label: "Include all",
      type: "boolean",
      description: "Select either fetch all items or paginated results.",
      default: true,
      reloadProps: true,
    },
    tagName: {
      label: "Tag name",
      type: "string",
      description: "Optionally used to filter by a specific tag.\n\n**Example:** `production`",
      optional: true,
    },
  },
  async additionalProps() {
    if (this.includeAll === true) {
      return {};
    }
    return {
      currentPage: {
        label: "Current page",
        type: "integer",
        description: "Which 'page' of paginated results to return.",
        default: digitalOceanConstants.defaultCurrentPage,
      },
      pageSize: {
        label: "Page size",
        type: "integer",
        description: "Desired pagination size when pulling results",
        default: digitalOceanConstants.defaultPageSize,
      },
    };
  },
  async run({ $ }) {
    const includeAll = this.includeAll;
    const tagName = this.tagName || undefined;
    const pageSize = this.pageSize || digitalOceanConstants.defaultCurrentPage;
    const currentPage = this.currentPage || digitalOceanConstants.defaultCurrentPage;
    const api = this.digitalOceanApp.digitalOceanWrapper(pageSize);

    const args = includeAll
      ? [
        tagName,
        includeAll,
      ]
      : [
        tagName,
        includeAll,
        currentPage,
        pageSize,
      ];
    const response = await api.droplets.getAll(...args);
    $.export("$summary", `Successfully fetched ${response?.length || response?.droplets?.length} droplet(s).`);
    return response;
  },
};
