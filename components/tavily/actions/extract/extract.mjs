import app from "../../tavily.app.mjs";
import constants from "../../common/constants.mjs";
import {
  validateList,
  validateRange,
} from "../../common/validation.mjs";

export default {
  key: "tavily-extract",
  name: "Extract Content",
  description: "Extract clean content from up to 20 URLs, optionally focusing on a query. Returns successful and failed extractions. [See the documentation](https://docs.tavily.com/documentation/api-reference/endpoint/extract)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    urls: {
      propDefinition: [
        app,
        "urls",
      ],
    },
    extractDepth: {
      type: "string",
      label: "Extract Depth",
      description: "Use basic for standard extraction or advanced for complex pages and tables. Advanced extraction uses more credits.",
      options: constants.EXTRACT_DEPTHS,
      optional: true,
    },
    query: {
      propDefinition: [
        app,
        "query",
      ],
      description: "Rank extracted chunks by relevance to this query. Leave unset to return full content.",
      optional: true,
    },
    chunksPerSource: {
      type: "integer",
      label: "Chunks per Source",
      description: "Maximum relevant chunks per URL, from 1 to 5. Only applies when Query is provided.",
      optional: true,
    },
    format: {
      type: "string",
      label: "Content Format",
      description: "Return content as markdown or plain text. The API defaults to markdown.",
      options: constants.CONTENT_FORMATS,
      optional: true,
    },
    includeImages: {
      propDefinition: [
        app,
        "includeImages",
      ],
    },
    includeFavicon: {
      propDefinition: [
        app,
        "includeFavicon",
      ],
    },
    timeout: {
      type: "string",
      label: "Timeout",
      description: "Maximum extraction wait in seconds, from 1 to 60 (decimals allowed, for example 2.5). Leave unset for the API default (10 for basic, 30 for advanced).",
      optional: true,
    },
    includeUsage: {
      propDefinition: [
        app,
        "includeUsage",
      ],
    },
  },
  async run({ $ }) {
    validateList(this.urls, "URLs", 1, 20);
    validateRange(this.chunksPerSource, "Chunks per Source", 1, 5);
    const timeout = this.timeout === undefined
      ? undefined
      : Number(this.timeout);
    validateRange(timeout, "Timeout", 1, 60, false);
    const response = await this.app.extract({
      $,
      data: {
        urls: this.urls,
        extract_depth: this.extractDepth,
        query: this.query,
        chunks_per_source: this.chunksPerSource,
        format: this.format,
        include_images: this.includeImages,
        include_favicon: this.includeFavicon,
        timeout,
        include_usage: this.includeUsage,
      },
    });

    const succeeded = response.results?.length ?? 0;
    const failed = response.failed_results?.length ?? 0;
    $.export("$summary", `Extracted content from ${succeeded} URLs; ${failed} failed`);
    return response;
  },
};
