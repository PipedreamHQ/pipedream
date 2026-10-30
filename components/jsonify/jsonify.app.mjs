import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import { PAGE_SIZE } from "./common/constants.mjs";
import { buildParams } from "./common/utils.mjs";

export default {
  type: "app",
  app: "jsonify",
  propDefinitions: {
    serveUrl: {
      type: "string",
      label: "Dataset Serve URL",
      description: "The serve URL of a Jsonify dataset, from the dataset's Integrations > REST API tab. e.g. `https://factory.jsonify.com/api/serve/6332465e4d05`. Treat it as a secret.",
      secret: true,
    },
    columns: {
      type: "string[]",
      label: "Columns",
      description: "Column names to return, e.g. `[\"_row_id\", \"competitor\", \"url\"]`. Leave empty to return all columns. Use **Get Dataset Rows** without this prop to see the dataset's columns.",
      optional: true,
    },
    filters: {
      type: "object",
      label: "Filters",
      description: "Exact, case-sensitive matches on column values, combined with AND. Keys are column names, values are the text to match, e.g. `{\"competitor\": \"Acme\", \"currency\": \"USD\"}`. Up to 10 filters. Run **Get Dataset Rows** without filters to see the dataset's column names.",
      optional: true,
    },
    version: {
      type: "integer",
      label: "Version",
      description: "Dataset version number to read, e.g. `12`. Leave empty for the active version. Use **Get Dataset Rows** to find the current version (the `version` field in its result).",
      optional: true,
    },
    timer: {
      type: "$.interface.timer",
      description: "How often to check the dataset for changes",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    /**
     * Fetch one page of rows from a dataset serve URL.
     * @param {object} opts
     * @param {object} [opts.$] - Pipedream step context.
     * @param {string} opts.serveUrl - The dataset serve URL.
     * @returns {Promise<object>} The page: dataset metadata, `version`, `rows`, `has_more`, `next_offset`.
     */
    async getPage({
      $ = this, serveUrl, ...opts
    }) {
      return axios($, {
        url: serveUrl,
        params: buildParams(opts),
      });
    },
    /**
     * Yield every matching row, paging with `has_more`/`next_offset` and pinning the
     * version of the first page so a republish mid-run never mixes versions.
     * @param {object} opts
     * @param {number} [opts.max] - Stop after this many rows; `0` yields none.
     * @yields {{row: object, page: object}}
     */
    async *paginate({
      $, serveUrl, max, columns, filters, version,
    }) {
      let offset = 0;
      let pinnedVersion = version;
      let count = 0;
      while (true) {
        const page = await this.getPage({
          $,
          serveUrl,
          limit: PAGE_SIZE,
          offset,
          columns,
          filters,
          version: pinnedVersion,
        });
        pinnedVersion ??= page.version;
        for (const row of page.rows || []) {
          if (max !== undefined && max !== null && count >= max) {
            return;
          }
          yield {
            row,
            page,
          };
          count += 1;
        }
        if (!page.has_more || page.next_offset == null) {
          return;
        }
        offset = page.next_offset;
      }
    },
  },
};
