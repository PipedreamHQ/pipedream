import zep from "../../zep.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "zep-get-threads",
  name: "Get Threads",
  description: "Returns a paginated list of threads. [See the documentation](https://help.getzep.com/sdk-reference/thread/list-all)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zep,
    order_by: {
      type: "string",
      label: "Order By",
      description: "Field to order by (e.g., updated_at).",
      optional: true,
      options: constants.SORT_OPTIONS,
    },
    asc: {
      type: "boolean",
      label: "Ascending",
      description: "If true, results are returned in ascending order.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of threads to return across pages.",
      optional: true,
      default: 50,
    },
  },
  async run({ $ }) {
    const max = this.maxResults ?? 50;
    const threads = [];

    let page = 1;
    while (threads.length < max) {
      const pageSize = Math.min(1000, max - threads.length);
      const params = {
        page_number: page,
        page_size: pageSize,
      };

      if (this.order_by) {
        params.order_by = this.order_by;
      }
      if (typeof this.asc === "boolean") {
        params.asc = this.asc;
      }

      const response = await this.zep.getThreads({
        $,
        params,
      });

      const pageThreads = response?.threads || [];
      if (!Array.isArray(pageThreads) || pageThreads.length === 0) {
        break;
      }

      threads.push(...pageThreads);
      if (pageThreads.length < pageSize) {
        break;
      }

      page += 1;
    }

    const plural = threads.length === 1
      ? ""
      : "s";
    $.export("$summary", `Successfully retrieved ${threads.length} thread${plural}`);
    return threads;
  },
};
