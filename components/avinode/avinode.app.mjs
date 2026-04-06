import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "avinode",
  propDefinitions: {
    airportId: {
      type: "string",
      label: "Airport ID",
      description:
        "Search by name or code, pick from the list, or enter an ID manually. [Search airports](https://developer.avinodegroup.com/reference/searchairports-1)",
      useQuery: true,
      async options({
        $, query, prevContext,
      }) {
        const pageSize = 50;
        const pageNumber = prevContext?.nextPageNumber ?? 1;
        const body = await this.searchAirports({
          $,
          filter: query,
          pageNumber,
          pageSize,
        });

        const airports = Array.isArray(body?.data)
          ? body.data
          : [];
        const pag = body?.meta?.pagination;
        const batchSize = pag?.batchSize ?? pageSize;
        const currentPage = pag?.pageNumber ?? pageNumber;
        const totalCount = pag?.totalCount;

        let nextPageNumber;
        if (typeof totalCount === "number" && airports.length > 0) {
          const loaded = (currentPage - 1) * batchSize + airports.length;
          if (loaded < totalCount && airports.length >= Math.min(batchSize, pageSize)) {
            nextPageNumber = currentPage + 1;
          }
        } else if (airports.length >= pageSize) {
          nextPageNumber = pageNumber + 1;
        }

        const options = airports.map((a) => {
          const label =
            a.displayName
            || [
              a.displayCodes,
              a.name,
            ]
              .filter(Boolean)
              .join(" — ")
            || String(a.id);
          return {
            value: String(a.id),
            label,
          };
        });

        return {
          options,
          context: nextPageNumber
            ? {
              nextPageNumber,
            }
            : {},
        };
      },
    },
  },
  methods: {
    /**
     * API base URL (no trailing slash).
     * Uses `base_url` from the connected account or the Avinode sandbox default.
     */
    _baseUrl() {
      const raw =
        this.$auth.base_url?.toString?.() || "https://sandbox.avinode.com/api";
      return raw.replace(/\/+$/, "");
    },
    /**
     * Headers required by Avinode Marketplace / Trip Manager APIs.
     */
    _headers() {
      const accessToken = this.$auth.access_token?.toString?.();
      const apiToken = this.$auth.api_token?.toString?.();
      if (!accessToken) {
        throw new Error(
          "Authentication token is required. Add it in your Avinode connected account.",
        );
      }
      if (!apiToken) {
        throw new Error(
          "API token (X-Avinode-ApiToken) is required. Add it in your Avinode connected account.",
        );
      }
      const productName =
        this.$auth.product_name?.toString?.() || "Pipedream/1.0";
      const headers = {
        "Authorization": `Bearer ${accessToken}`,
        "X-Avinode-ApiToken": apiToken,
        "X-Avinode-Product": productName,
        "X-Avinode-SentTimestamp": new Date().toISOString(),
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
      const actAs = this.$auth.act_as_account?.toString?.();
      if (actAs) {
        headers["X-Avinode-ActAsAccount"] = actAs;
      }
      return headers;
    },
    /**
     * @param {object} opts
     * @param {*} [opts.$] - Pipedream context (`$`) for axios
     * @param {string} opts.path - Path beginning with `/`
     * @param {string} [opts.method]
     * @param {object} [opts.data]
     * @param {object} [opts.params] - Query string params (use `path` for repeated keys)
     */
    async _makeRequest({
      $ = this,
      path,
      method = "GET",
      data,
      params,
      ...args
    }) {
      const base = this._baseUrl();
      const p = path.startsWith("/")
        ? path
        : `/${path}`;
      return axios($, {
        url: `${base}${p}`,
        method,
        headers: this._headers(),
        data,
        params,
        ...args,
      });
    },
    /**
     * List all aircraft types (GET /aircrafttypes), following paginated results until exhausted.
     * @see https://developer.avinodegroup.com/reference/listaircrafttypes
     * @param {object} [opts]
     * @param {*} [opts.$]
     * @param {number} [opts.pageSize] - Batch size per request (page[size])
     * @param {string[]} [opts.fields] - Sparse fields: perfdetails, typedetails, typephotos
     * @returns {Promise<object[]>} Combined `data` items from all pages
     */
    async listAircraftTypes({
      $ = this,
      pageSize = 100,
      fields,
    } = {}) {
      const all = [];
      let pageNumber = 1;
      const maxPages = 500;

      for (let i = 0; i < maxPages; i++) {
        const sp = new URLSearchParams();
        sp.set("page[size]", String(pageSize));
        sp.set("page[number]", String(pageNumber));
        for (const f of fields || []) {
          sp.append("fields[aircrafttypes]", String(f));
        }

        const body = await this._makeRequest({
          $,
          path: `/aircrafttypes?${sp.toString()}`,
        });

        const batch = Array.isArray(body?.data)
          ? body.data
          : [];
        if (batch.length === 0) {
          break;
        }
        all.push(...batch);

        const pag = body?.meta?.pagination;
        if (pag && typeof pag.totalCount === "number") {
          if (all.length >= pag.totalCount) {
            break;
          }
          const reportedSize = pag.batchSize ?? pageSize;
          if (batch.length < reportedSize) {
            break;
          }
        } else if (batch.length < pageSize) {
          break;
        }

        pageNumber += 1;
      }

      return all;
    },
    /**
     * Search airports (GET /airports/search).
     * @see https://developer.avinodegroup.com/reference/searchairports-1
     * @param {object} [opts]
     * @param {*} [opts.$]
     * @param {string} [opts.filter] - Search criteria (`filter` query param)
     * @param {"contains"|"starts_with"} [opts.filterMatchType] - Default `contains`
     * @param {number} [opts.pageNumber] - `page[number]` (1-based)
     * @param {number} [opts.pageSize] - `page[size]`
     * @returns {Promise<object>} Parsed JSON body (`data`, `meta`, …)
     */
    async searchAirports({
      $ = this,
      filter,
      filterMatchType = "contains",
      pageNumber = 1,
      pageSize = 50,
    } = {}) {
      const sp = new URLSearchParams();
      const q = filter?.toString?.()?.trim();
      if (q) {
        sp.set("filter", q);
      }
      sp.set("filterMatchType", filterMatchType);
      sp.set("page[number]", String(pageNumber));
      sp.set("page[size]", String(pageSize));

      return this._makeRequest({
        $,
        path: `/airports/search?${sp.toString()}`,
      });
    },
    /**
     * Read a single airport (GET /airports/{airportId}).
     * @see https://developer.avinodegroup.com/reference/readairport-1
     * @param {object} opts
     * @param {*} [opts.$]
     * @param {string} opts.airportId - Airport identifier
     * @returns {Promise<object>} Parsed JSON response body
     */
    async getAirport({
      $ = this,
      airportId,
    } = {}) {
      const id = airportId?.toString?.()?.trim();
      if (!id) {
        throw new Error("airportId is required");
      }
      return this._makeRequest({
        $,
        path: `/airports/${encodeURIComponent(id)}`,
      });
    },
  },
};
