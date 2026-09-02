import { axios } from "@pipedream/platform";
import methods from "./common/methods.mjs";

const SEARCH_CONSOLE_V3 = "https://searchconsole.googleapis.com/webmasters/v3";
const URL_INSPECTION_V1 = "https://searchconsole.googleapis.com/v1";

export default {
  type: "app",
  app: "google_search_console",
  propDefinitions: {
    siteUrl: {
      type: "string",
      label: "Property (siteUrl)",
      description: "Exact property identifier as returned by **List Sites** — `sc-domain:example.com` for a domain property, or a URL-prefix such as `https://www.example.com/` (trailing slash; scheme and subdomain must match exactly). Copy it verbatim; never construct it. For traffic questions prefer the domain property when one exists (it covers all subdomains and protocols).",
    },
    sitemapUrl: {
      type: "string",
      label: "Sitemap URL",
      description: "Full URL of the sitemap or sitemap index, e.g. `https://www.example.com/sitemap.xml`. It must live under the property given in `siteUrl` (for a domain property, any subdomain or scheme of that domain qualifies). Use **List Sitemaps** to see the exact paths Search Console already knows about.",
    },
    searchType: {
      type: "string",
      label: "Search Type",
      description: "Which Google surface to report on. `web` (default) is normal Google Search; `discover` is the Discover feed (has no `query` dimension); `googleNews` is the news.google.com surface, `news` is the News tab of Google Search. Sent to the API as the `type` field.",
      optional: true,
      options: [
        "web",
        "image",
        "video",
        "news",
        "discover",
        "googleNews",
      ],
      default: "web",
    },
    filterDimension: {
      type: "string",
      label: "Filter Dimension",
      description: "Dimension the single-filter shortcut applies to. Filtering does not require grouping by the same dimension — you can filter by `page` while grouping by `query`. `page` expressions match the FULL URL (including scheme and host), not a path. Default `page`.",
      optional: true,
      options: [
        "country",
        "device",
        "page",
        "query",
        "searchAppearance",
      ],
      default: "page",
    },
    filterOperator: {
      type: "string",
      label: "Filter Operator",
      description: "How the filter value is compared. String comparison is case-insensitive. `includingRegex`/`excludingRegex` use RE2 syntax (no lookahead/lookbehind). Default `contains`.",
      optional: true,
      options: [
        "equals",
        "notEquals",
        "contains",
        "notContains",
        "includingRegex",
        "excludingRegex",
      ],
      default: "contains",
    },
    advancedDimensionFilters: {
      type: "string",
      label: "Advanced Dimension Filters",
      description: "JSON for multi-condition filtering, used only when the single-filter shortcut is empty. Accepts either a bare array of filters, which is ANDed into one group — e.g. `[{\"dimension\":\"country\",\"operator\":\"equals\",\"expression\":\"usa\"},{\"dimension\":\"device\",\"operator\":\"equals\",\"expression\":\"MOBILE\"}]` — or the raw API `dimensionFilterGroups` array, e.g. `[{\"groupType\":\"and\",\"filters\":[{\"dimension\":\"page\",\"operator\":\"contains\",\"expression\":\"/blog/\"}]}]`. The API only supports `groupType: \"and\"`; there is no OR. Regex operators use RE2.",
      optional: true,
    },
  },
  methods: {
    ...methods,
    _makeRequest({
      $ = this,
      url,
      ...opts
    }) {
      return axios($, {
        url,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    async getSites(params = {}) {
      return this._makeRequest({
        method: "GET",
        url: "https://searchconsole.googleapis.com/webmasters/v3/sites",
        ...params,
      });
    },
    getUserInfo(opts = {}) {
      return this._makeRequest({
        method: "GET",
        url: "https://www.googleapis.com/oauth2/v3/userinfo",
        ...opts,
      });
    },
    getSitePerformanceData({
      url, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        url: `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(url)}/searchAnalytics/query`,
        ...opts,
      });
    },
    listSitemaps({
      siteUrl, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        url: `${SEARCH_CONSOLE_V3}/sites/${encodeURIComponent(siteUrl)}/sitemaps`,
        ...opts,
      });
    },
    getSitemap({
      siteUrl, sitemapUrl, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        url: `${SEARCH_CONSOLE_V3}/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
        ...opts,
      });
    },
    submitSitemap({
      siteUrl, sitemapUrl, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `${SEARCH_CONSOLE_V3}/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
        ...opts,
      });
    },
    deleteSitemap({
      siteUrl, sitemapUrl, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        url: `${SEARCH_CONSOLE_V3}/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
        ...opts,
      });
    },
    inspectUrl(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: `${URL_INSPECTION_V1}/urlInspection/index:inspect`,
        ...opts,
      });
    },
    submitUrlForIndexing(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
        ...opts,
      });
    },
  },
};
