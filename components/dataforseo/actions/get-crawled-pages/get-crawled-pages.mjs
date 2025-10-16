import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-crawled-pages",
  name: "Get Crawled Pages with OnPage",
  description: "Get page-specific data with detailed information on how well your pages are optimized for search. [See the documentation](https://docs.dataforseo.com/v3/on_page/pages/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dataforseo,
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task. You can get this ID in the response of the Task POST endpoint. Example: `07131248-1535-0216-1000-17384017ad04`",
    },
    limit: {
      propDefinition: [
        dataforseo,
        "limit",
      ],
    },
    searchAfterToken: {
      type: "string",
      label: "Search After Token",
      description: "The token for subsequent requests",
      optional: true,
    },
    tag: {
      propDefinition: [
        dataforseo,
        "tag",
      ],
    },
  },
  methods: {
    getCrawledPage(args = {}) {
      return this.dataforseo._makeRequest({
        path: "/on_page/pages",
        method: "post",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const response = await this.getCrawledPage({
      $,
      data: [
        {
          id: this.taskId,
          limit: this.limit,
          search_after_token: this.searchAfterToken,
          tag: this.tag,
        },
      ],
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", "Successfully retrieved crawled pages.");
    return response;
  },
};
