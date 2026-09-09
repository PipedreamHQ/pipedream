import googleSearchConsole from "../../google_search_console.app.mjs";
import { trimIfString } from "../../common/utils.mjs";

export default {
  name: "List Sitemaps",
  description: "Lists the sitemaps Google Search Console knows about for a property, with their error, "
    + "warning and freshness state normalized to numbers."
    + "\n\n**Use for** any sitemap question — which are submitted, which have errors or warnings, when "
    + "Google last downloaded one, how many URLs it contains. Always call it before **Delete Sitemap** "
    + "when the user has not named an exact sitemap URL, and after **Submit Sitemap** or **Delete "
    + "Sitemap** to confirm the new state: in both cases leave `sitemapUrl` empty and look for the "
    + "`path`, because a single-path lookup of a deleted or unknown sitemap returns 404."
    + "\n\n**Not for** whether the URLs inside a sitemap are indexed (use **Inspect URLs**). This tool "
    + "reports what Google recorded about a sitemap; it does not fetch or parse the XML itself."
    + "\n\n**Returns** `{ sitemaps: [...], count, summary: { with_errors, with_warnings, pending, "
    + "never_downloaded } }`. `path` is the full sitemap URL and is the exact string to pass to "
    + "**Submit Sitemap** or **Delete Sitemap**. `warnings`, `errors` and `submitted_urls` are integers "
    + "here (the raw API returns strings); `submitted_urls` is the sum of `contents[].submitted`. "
    + "`isPending: true` means Google accepted the sitemap but has not fetched it yet. A sitemap with no "
    + "`lastDownloaded` has never been downloaded and is counted in `summary.never_downloaded`."
    + "\n\n**Mistakes.** Do not guess a sitemap URL — list first and use a `path` from the result; an "
    + "unknown path returns 404 \"'<url>' is not a submitted or a known sitemap.\" `lastDownloaded` can "
    + "be years old while the sitemap is still valid, so report the date rather than treating it as an "
    + "error. `errors` and `warnings` count sitemap-parsing problems, not indexing problems."
    + "\n\n**Example.** `siteUrl=\"sc-domain:example.com\"` with no other input returns "
    + "`{ count: 3, summary: { with_errors: 1, ... }, sitemaps: [{ path: "
    + "\"https://www.example.com/sitemap.xml\", lastDownloaded: \"2018-05-06T02:44:10.000Z\", "
    + "errors: 1, warnings: 1, submitted_urls: 2, contents: [{ type: \"web\", submitted: \"2\", "
    + "indexed: \"0\" }] }, ...] }` — so \"when was it last downloaded and how many URLs?\" is 6 May "
    + "2018 and 2 URLs."
    + "\n\n[See the documentation](https://developers.google.com/webmaster-tools/v1/sitemaps/list)",
  key: "google_search_console-list-sitemaps",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    googleSearchConsole,
    siteUrl: {
      propDefinition: [
        googleSearchConsole,
        "siteUrl",
      ],
    },
    sitemapUrl: {
      propDefinition: [
        googleSearchConsole,
        "sitemapUrl",
      ],
      optional: true,
      description: "Optional. Full URL of one sitemap, to return just that sitemap. Leave empty to "
        + "list every sitemap for the property. An unknown URL returns 404 \"'<url>' is not a "
        + "submitted or a known sitemap.\", so do not use this to check whether a sitemap exists or "
        + "was deleted — list everything and look for the `path`.",
    },
    sitemapIndex: {
      type: "string",
      label: "Sitemap Index URL",
      description: "Optional. Full URL of a sitemap index, e.g. "
        + "`https://www.example.com/sitemap_index.xml`. When set, only the child sitemaps inside that "
        + "index are listed. Leave empty to list all sitemaps, and never set it together with Sitemap "
        + "URL (the call fails if both are set). To find an index URL, call this action with no "
        + "filters and take the `path` of an entry whose `isSitemapsIndex` is `true`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      googleSearchConsole,
      siteUrl,
      sitemapUrl,
      sitemapIndex,
    } = this;

    const trimmedSiteUrl = trimIfString(siteUrl);
    const trimmedSitemapUrl = trimIfString(sitemapUrl);
    const trimmedSitemapIndex = trimIfString(sitemapIndex);

    if (trimmedSitemapUrl && trimmedSitemapIndex) {
      throw new Error("Set either `sitemapUrl` (return one sitemap) or `sitemapIndex` (list the children of an index), not both.");
    }

    let records;

    if (trimmedSitemapUrl) {
      const record = await googleSearchConsole.getSitemap({
        $,
        siteUrl: trimmedSiteUrl,
        sitemapUrl: trimmedSitemapUrl,
      });
      records = [
        record,
      ];
    } else {
      const params = {};
      if (trimmedSitemapIndex) {
        params.sitemapIndex = trimmedSitemapIndex;
      }
      const response = await googleSearchConsole.listSitemaps({
        $,
        siteUrl: trimmedSiteUrl,
        params,
      });
      records = response?.sitemap ?? [];
    }

    const sitemaps = records.map((record) => {
      const contents = record?.contents ?? [];
      return {
        path: record?.path ?? null,
        type: record?.type ?? null,
        isSitemapsIndex: record?.isSitemapsIndex ?? false,
        isPending: record?.isPending ?? false,
        lastSubmitted: record?.lastSubmitted ?? null,
        lastDownloaded: record?.lastDownloaded ?? null,
        warnings: Number(record?.warnings ?? 0),
        errors: Number(record?.errors ?? 0),
        submitted_urls: contents.reduce((total, entry) => total + Number(entry?.submitted ?? 0), 0),
        contents,
      };
    });

    const summary = {
      with_errors: sitemaps.filter((sitemap) => sitemap.errors > 0).length,
      with_warnings: sitemaps.filter((sitemap) => sitemap.warnings > 0).length,
      pending: sitemaps.filter((sitemap) => sitemap.isPending).length,
      never_downloaded: sitemaps.filter((sitemap) => !sitemap.lastDownloaded).length,
    };

    $.export("$summary", `Found ${sitemaps.length} sitemap(s) for ${trimmedSiteUrl}: ${summary.with_errors} with errors, ${summary.with_warnings} with warnings`);

    return {
      sitemaps,
      count: sitemaps.length,
      summary,
    };
  },
};
