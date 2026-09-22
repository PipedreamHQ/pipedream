import googleSearchConsole from "../../google_search_console.app.mjs";
import { trimIfString } from "../../common/utils.mjs";

export default {
  name: "Delete Sitemap",
  description: "Unlists a sitemap from a Google Search Console property. Destructive, and not "
    + "reversible by this tool."
    + "\n\n**Confirm before calling.** Only call it once the user has explicitly confirmed the exact "
    + "`sitemapUrl`. If the ask is vague (\"remove the old sitemap\"), call **List Sitemaps** first, "
    + "show the candidate paths and ask which one. If the user names a sitemap but has not confirmed "
    + "the deletion, state the exact `sitemapUrl` you are about to delete and ask. Silence is not "
    + "consent: if you cannot obtain an explicit confirmation in this turn (for example no confirmation "
    + "prompt is available), end your turn by asking in plain text and do NOT call this tool. Never "
    + "delete a sitemap as a side effect of another task, and never delete-and-resubmit to \"refresh\" "
    + "one — **Submit Sitemap** on the existing path already does that."
    + "\n\n**What this does NOT do.** It only UNLISTS the sitemap from Search Console. The pages it "
    + "contained stay in Google's index and remain crawlable, and the sitemap file stays on the "
    + "website. Do not offer this tool as a way to remove content from Google."
    + "\n\n**Returns** `{ deleted: true, sitemapUrl }` — the API body is empty, so there is nothing "
    + "else to report. To prove it is gone, call **List Sitemaps** with NO `sitemapUrl` and check the "
    + "`path` is absent; asking for the deleted path directly returns 404 \"'<url>' is not a submitted "
    + "or a known sitemap.\", which reads as an error."
    + "\n\n**Mistakes.** Passing a path (`/sitemap.xml`) or a guessed URL instead of a `path` from "
    + "**List Sitemaps** returns that same 404 — and so does the `https://www.` variant when the "
    + "property lists the `http://` one, because host and scheme are part of the identity. Requires "
    + "`siteOwner` or `siteFullUser`; a `siteRestrictedUser` gets 403."
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
