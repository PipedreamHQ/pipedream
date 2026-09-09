import googleSearchConsole from "../../google_search_console.app.mjs";
import { trimIfString } from "../../common/utils.mjs";

export default {
  name: "Submit Sitemap",
  description: "Submits a sitemap (or resubmits one already listed) to Google Search Console for a "
    + "property, then reads the stored record back. Resubmitting is idempotent — it creates no "
    + "duplicate, it updates `lastSubmitted` and sets `isPending: true`."
    + "\n\n**Use for** a new sitemap, or when the user wants Google to pick up new or changed pages on "
    + "a site: resubmitting an existing sitemap is the SUPPORTED way to ask Google to re-read it."
    + "\n\n**There is no API to request indexing of a single ordinary page.** The \"Request indexing\" "
    + "button in the Search Console UI has no API equivalent, and the Indexing API behind **Submit URL "
    + "for Indexing** covers only JobPosting and BroadcastEvent pages. So the two legitimate options "
    + "are this tool (have Google re-read the sitemap containing the page) and **Inspect URLs** (check "
    + "the page's current index status). Say that plainly rather than implying a page can be "
    + "force-indexed — and when the user asks to request indexing or force a recrawl, OFFER those two "
    + "options and wait for them to pick one; do not run either unasked."
    + "\n\n**Returns** `{ submitted: true, sitemap, previous_last_submitted }`. The submit call itself "
    + "returns an empty body, so `sitemap` is the record read back from Google immediately afterwards "
    + "and is how you confirm it landed. `previous_last_submitted` is the `lastSubmitted` the sitemap "
    + "had before this call, or `null` for a first submission — use it to tell a fresh submission from "
    + "a resubmission. Right after a submit `isPending` is normally `true` and `lastDownloaded` still "
    + "holds the old date (or is absent): Google fetches asynchronously, usually within minutes to "
    + "days. So do NOT report a sitemap as \"processed\" or \"indexed\" on the strength of a successful "
    + "submit."
    + "\n\n**Mistakes.** `sitemapUrl` must be an absolute URL to the sitemap file "
    + "(`https://www.example.com/sitemap.xml`) that lives under the property — not a page URL, a path "
    + "(`/sitemap.xml`) or a property identifier. If the user has not given you a sitemap URL, ask for "
    + "it rather than guessing a conventional path. Submitting is not indexing: Google may still choose "
    + "not to index the URLs it finds. Do not delete and resubmit to \"refresh\" a sitemap — just "
    + "resubmit. Requires `siteOwner` or `siteFullUser` (check with **List Sites**); a "
    + "`siteRestrictedUser` gets 403."
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
