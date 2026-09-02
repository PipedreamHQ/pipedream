import googleSearchConsole from "../../google_search_console.app.mjs";
import { trimIfString } from "../../common/utils.mjs";

export default {
  name: "Delete Sitemap",
  description: "Removes (unlists) a sitemap from a Google Search Console property."
    + "\n\n**Purpose.** Tells Search Console to stop tracking a sitemap file. This is a destructive, "
    + "non-reversible-by-this-tool operation on the property's configuration."
    + "\n\n**When to use.** Only when the user has EXPLICITLY confirmed the exact sitemap URL to remove. "
    + "If the user says something vague such as \"remove the old sitemap\", do NOT call this tool: call "
    + "**List Sitemaps** first, show the candidate paths, and ask which one. If the user names a sitemap "
    + "but has not confirmed the deletion, state the exact `sitemapUrl` you are about to delete and ask "
    + "for confirmation before calling. Never treat the absence of an answer as consent: "
    + "if you cannot obtain an explicit confirmation in this turn (for example a "
    + "confirmation prompt is unavailable), end your turn by asking the question in plain "
    + "text and do NOT call this tool. Never delete a sitemap as a side effect of another "
    + "task, and never delete-and-resubmit to \"refresh\" a sitemap - **Submit Sitemap** on "
    + "the existing path already does that."
    + "\n\n**Returns.** `{ deleted: true, sitemapUrl }` on success. The API returns an empty body, so "
    + "there is nothing else to report; to prove it is gone, call **List Sitemaps** WITHOUT "
    + "`sitemapUrl` (list everything and check the `path` is absent) — asking for the deleted path "
    + "directly returns 404 \"'<url>' is not a submitted or a known sitemap.\", which reads as an "
    + "error."
    + "\n\n**What this does NOT do.** It only UNLISTS the sitemap from Search Console. It does not "
    + "deindex, remove or hide the pages the sitemap contained - those URLs stay in Google's index and "
    + "can still be crawled and discovered through links. Do not offer this tool as a way to remove "
    + "content from Google. It also does not delete the sitemap file from the website."
    + "\n\n**Cross-references.** Get the exact `siteUrl` from **List Sites**. Get the exact `path` to "
    + "delete from **List Sitemaps**, and call it again afterwards (with no `sitemapUrl`) to verify "
    + "the path is absent. Use **Submit Sitemap** to add a sitemap back or to ask Google to re-read "
    + "one. Use **Inspect URLs** to check the index status of individual pages."
    + "\n\n**Parameter guidance.** `siteUrl` is the property identifier, copied verbatim from **List "
    + "Sites**. `sitemapUrl` is the full URL of the sitemap exactly as **List Sitemaps** reports it in "
    + "`path` - copy it, do not retype or normalize it (do not add or drop `www.`, do not change the "
    + "scheme). Both are required."
    + "\n\n**Common mistakes.** Passing a path (`/sitemap.xml`) or a guessed URL instead of a listed "
    + "`path`: an unknown path returns 404 \"'<url>' is not a submitted or a known sitemap.\" Passing "
    + "the `https://www.` variant when the property lists the `http://` one (or the other way round) "
    + "produces that same 404 - the host and scheme are part of the identity. Requires `siteOwner` or "
    + "`siteFullUser`; a `siteRestrictedUser` gets a 403."
    + "\n\n**Example.** `siteUrl=\"sc-domain:example.com\"`, "
    + "`sitemapUrl=\"https://www.example.com/sitemap-archive.xml\"` -> "
    + "`{ deleted: true, sitemapUrl: \"https://www.example.com/sitemap-archive.xml\" }`, "
    + "and a follow-up **List Sitemaps** call (no `sitemapUrl`) no longer shows that path."
    + "\n\n[See the documentation](https://developers.google.com/webmaster-tools/v1/sitemaps/delete)",
  key: "google_search_console-delete-sitemap",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
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
      description: "Full URL of the sitemap to unlist, copied verbatim from the `path` field returned "
        + "by **List Sitemaps**, e.g. `https://www.example.com/sitemap.xml`. An unknown path "
        + "returns 404 \"'<url>' is not a submitted or a known sitemap.\" Confirm this exact URL with "
        + "the user before calling.",
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

    await googleSearchConsole.deleteSitemap({
      $,
      siteUrl: trimmedSiteUrl,
      sitemapUrl: trimmedSitemapUrl,
    });

    $.export("$summary", `Deleted sitemap ${trimmedSitemapUrl} from ${trimmedSiteUrl}`);

    return {
      deleted: true,
      sitemapUrl: trimmedSitemapUrl,
    };
  },
};
