import googleSearchConsole from "../../google_search_console.app.mjs";
import { trimIfString } from "../../common/utils.mjs";

export default {
  name: "Submit Sitemap",
  description: "Submits a sitemap (or resubmits one that is already listed) to Google Search Console "
    + "for a property, then reads the stored record back."
    + "\n\n**Purpose.** Tells Google where a sitemap lives and asks it to fetch it. Resubmitting a "
    + "sitemap that is already listed is the SUPPORTED way to ask Google to re-read it, and the call is "
    + "idempotent: the re-submit does not create a duplicate, it updates `lastSubmitted` and sets "
    + "`isPending: true`."
    + "\n\n**When to use.** Use it when the user adds a new sitemap, or when the user wants Google to "
    + "pick up new or changed pages on a site. **There is no API to request indexing of a single "
    + "ordinary page** - the \"Request indexing\" button in the Search Console UI has no API equivalent, "
    + "and the Indexing API behind **Submit URL for Indexing** is only for JobPosting and BroadcastEvent "
    + "pages. So the two legitimate options are this tool (have Google re-read the sitemap that contains "
    + "the page) and **Inspect URLs** (check the page's current index status). Say that plainly rather "
    + "than implying a page can be force-indexed - and when the user asks to request indexing or "
    + "force a recrawl, OFFER these two options and wait for the user to pick one; do not run "
    + "either unasked."
    + "\n\n**Returns.** `{ submitted: true, sitemap, previous_last_submitted }`. `sitemap` is the record "
    + "read back from Google immediately after submission (`path`, `type`, `isPending`, "
    + "`isSitemapsIndex`, `lastSubmitted`, `lastDownloaded`, `warnings`, `errors`, `contents`) - the "
    + "submit call itself returns an empty body, so this read-back is how you confirm it landed. "
    + "`previous_last_submitted` is the `lastSubmitted` timestamp the sitemap had before this call, or "
    + "`null` for a first submission; use it to tell a fresh submission from a resubmission. Right after "
    + "a submit `isPending` is normally `true` and `lastDownloaded` still holds the old date (or is "
    + "absent): Google fetches the file asynchronously, usually within minutes to days. `isPending` stays "
    + "true until Google fetches it, so do not report a sitemap as \"processed\" or \"indexed\" on the "
    + "strength of a successful submit."
    + "\n\n**Cross-references.** Get the exact `siteUrl` from **List Sites**, and check there that the "
    + "account is `siteOwner` or `siteFullUser` first - a `siteRestrictedUser` cannot submit sitemaps and "
    + "gets a 403. Use **List Sitemaps** to find the exact `path` of an existing sitemap before "
    + "resubmitting it, and again afterwards to confirm the new state. Use **Inspect URLs** to check "
    + "whether specific pages are indexed. Use **Delete Sitemap** to unlist one."
    + "\n\n**Parameter guidance.** `siteUrl` is the property identifier, copied verbatim from **List "
    + "Sites**. `sitemapUrl` is the full URL of the sitemap file or sitemap index "
    + "(`https://www.example.com/sitemap.xml`), and it must live under the property: for a domain "
    + "property any subdomain and either scheme qualifies, but for a URL-prefix property the scheme, "
    + "host and path prefix must match. Both are required; if the user has not given you a sitemap URL, "
    + "ask for it rather than guessing a conventional path."
    + "\n\n**Common mistakes.** Do not pass a page URL, a path (`/sitemap.xml`) or a property identifier "
    + "as `sitemapUrl` - it must be an absolute URL to the sitemap file. A sitemap URL outside the "
    + "property is rejected. Submitting is not the same as indexing: Google may still choose not to index "
    + "the URLs it finds. Do not delete and resubmit a sitemap to \"refresh\" it - just resubmit."
    + "\n\n**Example.** `siteUrl=\"sc-domain:example.com\"`, "
    + "`sitemapUrl=\"https://www.example.com/sitemap.xml\"` -> "
    + "`{ submitted: true, previous_last_submitted: \"2018-05-05T20:11:42.000Z\", sitemap: "
    + "{ path: \"https://www.example.com/sitemap.xml\", type: \"sitemap\", isPending: true, "
    + "isSitemapsIndex: false, lastSubmitted: \"2026-09-02T14:03:11.000Z\", "
    + "lastDownloaded: \"2018-05-06T02:44:10.000Z\", errors: \"1\", warnings: \"1\" } }` - a "
    + "resubmission (there was a previous `lastSubmitted`) that is now pending a fresh fetch by Google."
    + "\n\n[See the documentation](https://developers.google.com/webmaster-tools/v1/sitemaps/submit)",
  key: "google_search_console-submit-sitemap",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    },
  },
  async run({ $ }) {
    const {
      googleSearchConsole,
      siteUrl,
      sitemapUrl,
    } = this;

    const trimmedSiteUrl = trimIfString(siteUrl);
    const trimmedSitemapUrl = trimIfString(sitemapUrl);

    // Read the current list first: a GET on a path Google does not know about 404s, so the list is
    // the only safe way to learn whether this is a first submission or a resubmission.
    const existing = await googleSearchConsole.listSitemaps({
      $,
      siteUrl: trimmedSiteUrl,
    });

    const priorRecord = (existing?.sitemap ?? [])
      .find((entry) => entry?.path === trimmedSitemapUrl);

    await googleSearchConsole.submitSitemap({
      $,
      siteUrl: trimmedSiteUrl,
      sitemapUrl: trimmedSitemapUrl,
    });

    const sitemap = await googleSearchConsole.getSitemap({
      $,
      siteUrl: trimmedSiteUrl,
      sitemapUrl: trimmedSitemapUrl,
    });

    const previousLastSubmitted = priorRecord?.lastSubmitted ?? null;

    const verb = previousLastSubmitted
      ? "Resubmitted"
      : "Submitted";

    $.export("$summary", `${verb} sitemap ${trimmedSitemapUrl} for ${trimmedSiteUrl}`);

    return {
      submitted: true,
      sitemap,
      previous_last_submitted: previousLastSubmitted,
    };
  },
};
