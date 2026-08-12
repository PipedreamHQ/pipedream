// x-pd-ai: optimized
import { axios } from "@pipedream/platform";
import { v4 as uuidv4 } from "uuid";
import options from "./common/options.mjs";

const MAX_LIMIT_PER_PAGE = 100;
const DEFAULT_MAX_RESULTS = 100;
const MAX_PAGES = 20;

export default {
  propDefinitions: {
    postedAtStart: {
      type: "string",
      label: "Posted At Start",
      description: "Shows only transactions with a posted_at_date on or after this date-time. This parameter is the date-time notation as defined by [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). Example: `2022-12-12T23:59:59.999Z`",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Max",
      description: "The maximum amount of registered that will be fetched. Defaults to `500`.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "User location",
      optional: true,
      async options({ prevContext }) {
        const LIMIT = 100;
        const res = await this.getLocations(prevContext.cursor, LIMIT);
        return {
          options: res.data.items?.map((item) => ({
            label: item.name,
            value: item.id,
          })),
          context: {
            cursor: res.data.next_cursor,
          },
        };
      },
    },
    department: {
      type: "string",
      label: "Departments",
      description: "User Department",
      optional: true,
      async options({ prevContext }) {
        const LIMIT = 100;
        const res = await this.getDepartments(prevContext.cursor, LIMIT);
        return {
          options: res.data.items?.map((item) => ({
            label: item.name,
            value: item.id,
          })),
          context: {
            cursor: res.data.next_cursor,
          },
        };
      },
    },
    user: {
      type: "string",
      label: "User",
      description: "User",
      optional: true,
      async options({ prevContext }) {
        const LIMIT = 100;
        const res = await this.getUsers(prevContext.cursor, LIMIT);
        return {
          options: res.data.items?.map((item) => ({
            label: `${item.first_name} ${item.last_name} <${item.email}>`,
            value: item.id,
          })),
          context: {
            cursor: res.data.next_cursor,
          },
        };
      },
    },
    cashAccount: {
      type: "string",
      label: "Cash Account",
      description: "Cash Account",
      optional: true,
      async options() {
        const { items } = await this.listCashAccounts();
        return items?.map((item) => ({
          label: item.name,
          value: item.id,
        })) ?? [];
      },
    },
    spendDuration: {
      type: "string",
      label: "Spend Duration",
      description: "How often the spend limit refreshes: `MONTHLY`, `QUARTERLY`, or `YEARLY` to refresh on that cadence, or `ONE_TIME` for a limit that never refreshes.",
      options: options.spendDuration,
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Return only the user with this exact email address, e.g. `jane@acme.com`. Brex supports a single email at a time, not a list.",
      optional: true,
    },
    userIds: {
      type: "string[]",
      label: "Users",
      description: "Return only records belonging to these users. Use **List Users** to find a user ID by email address.",
      optional: true,
    },
    merchantQuery: {
      type: "string",
      label: "Merchant",
      description: "Case-insensitive substring match on the merchant descriptor, e.g. `amazon` matches `AMAZON WEB SERVICES`. Brex has no server-side merchant filter, so this is applied after fetching.",
      optional: true,
    },
    minAmount: {
      type: "integer",
      label: "Min Amount",
      description: "Only return records of at least this amount, in the currency's smallest denomination — `700` is $7.00 in USD. Applied after fetching, like Merchant.",
      optional: true,
    },
    maxAmount: {
      type: "integer",
      label: "Max Amount",
      description: "Only return records of at most this amount, in the currency's smallest denomination — `700` is $7.00 in USD. Applied after fetching, like Merchant.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of records to return. Defaults to `100`.",
      optional: true,
      min: 1,
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://platform.brexapis.com";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Idempotency-Key": uuidv4(),
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    /**
     * Serializes query params, emitting array values as repeated keys with the key left
     * exactly as written. Brex spells its repeatable params differently per endpoint
     * (`expand[]`, `user_id[]`, `user_ids`), and axios' default would append a second
     * `[]` to keys that already carry one.
     *
     * @param {Object} params - The query parameters to serialize.
     * @returns {string} The URL-encoded query string.
     */
    _paramsSerializer(params) {
      return Object.entries(params)
        .filter(([
          , value,
        ]) => value !== undefined && value !== null)
        .flatMap(([
          key,
          value,
        ]) => (Array.isArray(value)
          ? value.map((item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`)
          : `${encodeURIComponent(key)}=${encodeURIComponent(value)}`))
        .join("&");
    },
    _getAxiosParams(opts = {}) {
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
        paramsSerializer: this._paramsSerializer,
      };
      return res;
    },
    async _paginate(max, axiosParams) {
      const TOTAL_LIMIT = max || 500;
      const DEFAULT_LIMIT_PER_PAGE = 100;

      let items = [];
      let limit = Math.min(DEFAULT_LIMIT_PER_PAGE, parseInt(TOTAL_LIMIT));
      let cursor;
      do {
        // Adjust the limit to avoid extra elements on the last page
        if (items.length + limit > TOTAL_LIMIT) {
          limit -= items.length + limit - TOTAL_LIMIT;
        }
        const res = await axios(this, this._getAxiosParams({
          ...axiosParams,
          params: {
            ...axiosParams.params,
            limit,
            cursor,
          },
        }));

        if (res.items) {
          items = [
            ...items,
            ...res.items,
          ];
        }

        cursor = res.next_cursor;
      } while (items.length < TOTAL_LIMIT && cursor);

      return items;
    },
    async _request({
      $ = this, ...opts
    }) {
      return axios($, this._getAxiosParams(opts));
    },
    /**
     * Walks a cursor-paginated Brex list endpoint, optionally applying a predicate that
     * the API cannot express server-side.
     *
     * @returns {Promise<{items: object[], scanned: number, truncated: boolean}>} `scanned`
     * counts every record fetched and `truncated` is true when records remain unread, so
     * callers can distinguish "no matches" from "stopped looking".
     */
    async _paginateItems({
      $, path, params, max = DEFAULT_MAX_RESULTS, filter,
    }) {
      const items = [];
      let cursor;
      let pages = 0;
      let scanned = 0;
      let unreadInPage = false;

      do {
        const res = await this._request({
          $,
          method: "GET",
          path,
          params: {
            ...params,
            cursor,
            // A predicate needs full pages to scan, since matches may be sparse.
            limit: filter
              ? MAX_LIMIT_PER_PAGE
              : Math.min(MAX_LIMIT_PER_PAGE, max),
          },
        });

        const page = res.items ?? [];
        scanned += page.length;

        for (let i = 0; i < page.length; i++) {
          if (filter && !filter(page[i])) {
            continue;
          }
          items.push(page[i]);
          if (items.length >= max) {
            unreadInPage = i < page.length - 1;
            break;
          }
        }

        cursor = res.next_cursor;
        pages++;
      } while (cursor && items.length < max && pages < MAX_PAGES);

      return {
        items,
        scanned,
        truncated: Boolean(cursor) || unreadInPage,
      };
    },
    async getUser({
      $, userId,
    }) {
      return this._request({
        $,
        method: "GET",
        path: `/v2/users/${userId}`,
      });
    },
    async getUserLimit({
      $, userId,
    }) {
      return this._request({
        $,
        method: "GET",
        path: `/v2/users/${userId}/limit`,
      });
    },
    async listUsersPaginated({
      $, params, max, filter,
    }) {
      return this._paginateItems({
        $,
        path: "/v2/users",
        params,
        max,
        filter,
      });
    },
    async listCardTransactionsPaginated({
      $, params, max, filter,
    }) {
      return this._paginateItems({
        $,
        path: "/v2/transactions/card/primary",
        params,
        max,
        filter,
      });
    },
    async listCashAccounts({ $ } = {}) {
      return this._request({
        $,
        method: "GET",
        path: "/v2/accounts/cash",
      });
    },
    async getLocations(cursor, limit) {
      return axios(this, this._getAxiosParams({
        method: "GET",
        path: "/v2/locations",
        params: {
          cursor,
          limit,
        },
        returnFullResponse: true,
      }));
    },
    async getDepartments(cursor, limit) {
      return axios(this, this._getAxiosParams({
        method: "GET",
        path: "/v2/departments",
        params: {
          cursor,
          limit,
        },
        returnFullResponse: true,
      }));
    },
    async getUsers(cursor, limit) {
      return axios(this, this._getAxiosParams({
        method: "GET",
        path: "/v2/users",
        params: {
          cursor,
          limit,
        },
        returnFullResponse: true,
      }));
    },
  },
};
