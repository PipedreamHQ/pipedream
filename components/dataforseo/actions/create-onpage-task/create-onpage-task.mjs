import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-create-onpage-task",
  name: "Create OnPage Task",
  description: "Create an OnPage task to retrieve detailed information on how well your pages are optimized for search. [See the documentation](https://docs.dataforseo.com/v3/on_page/task_post/)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    dataforseo,
    target: {
      propDefinition: [
        dataforseo,
        "target",
      ],
    },
    maxCrawlPages: {
      type: "integer",
      label: "Max Crawl Pages",
      description: "The number of pages to crawl on the specified domain",
    },
    startUrl: {
      type: "string",
      label: "Start URL",
      description: "The URL to start crawling from",
      optional: true,
    },
    loadResources: {
      type: "boolean",
      label: "Load Resources",
      description: "Set to `true` if you want to load image, stylesheets, scripts, and broken resources on the page",
      optional: true,
    },
    enableJavascript: {
      type: "boolean",
      label: "Enable Javascript",
      description: "Set to `true` if you want to load the scripts available on a page",
      optional: true,
    },
    tag: {
      propDefinition: [
        dataforseo,
        "tag",
      ],
    },
    pingbackUrl: {
      type: "string",
      label: "Pingback URL",
      description: "When a task is completed you will be notified by a GET request sent to the URL you have specified",
      optional: true,
    },
  },
  methods: {
    createOnpageTask(args = {}) {
      return this.dataforseo._makeRequest({
        path: "/on_page/task_post",
        method: "post",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const response = await this.createOnpageTask({
      $,
      data: [
        {
          target: this.target,
          max_crawl_pages: this.maxCrawlPages,
          start_url: this.startUrl,
          load_resources: this.loadResources,
          enable_javascript: this.enableJavascript,
          tag: this.tag,
          pingback_url: this.pingbackUrl,
        },
      ],
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000 && response.tasks[0].status_code !== 20100) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", "Successfully created onpage task.");
    return response;
  },
};
