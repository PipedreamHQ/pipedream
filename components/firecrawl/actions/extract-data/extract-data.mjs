import firecrawl from "../../firecrawl.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { parseObjectEntries } from "../../common/utils.mjs";

export default {
  key: "firecrawl-extract-data",
  name: "Extract Data",
  description: "Extract structured data from one or multiple URLs. [See the documentation](https://docs.firecrawl.dev/api-reference/endpoint/extract)",
  version: "0.0.1",
  type: "action",
  props: {
    firecrawl,
    urls: {
      type: "string[]",
      label: "URLs",
      description: "An array of one or more URLs. Supports wildcards (/*) for broader crawling.",
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "(Optional unless no schema): A natural language prompt describing the data you want or specifying how you want that data structured.",
      optional: true,
    },
    schema: {
      type: "object",
      label: "Schema",
      description: "(Optional unless no prompt): A more rigid structure if you already know the JSON layout.",
      optional: true,
    },
    enableWebSearch: {
      type: "boolean",
      label: "Enable Web Search",
      description: "When `true`, the extraction will use web search to find additional data",
      optional: true,
    },
    ignoreSitemap: {
      type: "boolean",
      label: "Ignore Sitemap",
      description: "When true, sitemap.xml files will be ignored during website scanning",
      optional: true,
    },
    includeSubdomains: {
      type: "boolean",
      label: "Include Subdomains",
      description: "When true, subdomains of the provided URLs will also be scanned",
      optional: true,
    },
    showSources: {
      type: "boolean",
      label: "Show Sources",
      description: "When true, the sources used to extract the data will be included in the response",
      optional: true,
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait For Completion",
      description: "Set to `true` to poll the API in 3-second intervals until the job is completed",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.prompt && !this.schema) {
      throw new ConfigurationError("Must enter one of Prompt or Schema");
    }

    let response = await this.firecrawl.extract({
      $,
      data: {
        urls: this.urls,
        prompt: this.prompt,
        schema: this.schema && parseObjectEntries(this.schema),
        enableWebSearch: this.enableWebSearch,
        ignoreSitemap: this.ignoreSitemap,
        includeSubdomains: this.includeSubdomains,
        showSources: this.showSources,
      },
    });

    if (this.waitForCompletion) {
      const id = response.id;
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      do {
        response = await this.firecrawl.getExtractStatus({
          $,
          id,
        });
        await timer(3000);
      } while (response.status === "processing");
    }

    if (response.success) {
      $.export("$summary", "Successfully extracted data.");
    }
    return response;
  },
};
