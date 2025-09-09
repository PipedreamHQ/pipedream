import { API_ENDPOINTS } from "../../common/constants.mjs";
import { buildPaginationParams } from "../../common/utils.mjs";

export default {
  name: "List Employees",
  description: "Retrieve a complete list of employees",
  key: "listEmployees",
  version: "0.1.0",
  type: "action",
  props: {
    buddee: {
      type: "app",
      app: "buddee",
      label: "Buddee",
      description: "The Buddee app instance to use",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of employees to return",
      default: 100,
      min: 1,
      max: 1000,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of employees to skip",
      default: 0,
      min: 0,
    },
  },
  async run({ $ }) {
    const params = buildPaginationParams(this.limit, this.offset);

    const response = await this.buddee._makeRequest({
      $,
      path: API_ENDPOINTS.EMPLOYEES,
      params,
    });

    return response.data;
  },
};
