import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import { PAGE_SIZE } from "./common/constants.mjs";

export default {
  type: "app",
  app: "jsonify",
  propDefinitions: {
    serveUrl: {
      type: "string",
      label: "Dataset Serve URL",
      description: "The serve URL of a Jsonify dataset, from the dataset's Integrations > REST API tab. It looks like `https://factory.jsonify.com/api/serve/<id>`. Treat it as a secret.",
      secret: true,
    },
    columns: {
      type: "string[]",
      label: "Columns",
      description: "Column names to return, for example `_row_id`, `competitor`, `url`. Leave empty to return all columns.",
      optional: true,
    },
    filters: {
      type: "object",
      label: "Filters",
      description: "Exact, case-sensitive matches on column values, combined with AND. Keys are column names, values are the text to match. Up to 10 filters.",
      optional: true,
    },
    version: {
      type: "integer",
      label: "Version",
      description: "Dataset version to read. Leave empty for the active version.",
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
    buildParams({
      limit, offset = 0, columns, filters, version,
    }) {
      const params = {
        limit,
        offset,
      };
      if (columns?.length) {
        params.columns = columns.join(",");
      }
      if (version !== undefined && version !== null) {
        params.version = version;
      }
      for (const [
        column,
        value,
      ] of Object.entries(filters || {})) {
        params[`filter[${column}]`] = value;
      }
      return params;
    },
    async getPage({
      $ = this, serveUrl, ...opts
    }) {
      return axios($, {
        url: serveUrl,
        params: this.buildParams(opts),
      });
    },
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
          yield {
            row,
            page,
          };
          count += 1;
          if (max && count >= max) {
            return;
          }
        }
        if (!page.has_more || page.next_offset == null) {
          return;
        }
        offset = page.next_offset;
      }
    },
  },
};
