import googleSearchConsole from "../../google_search_console.app.mjs";
import { trimIfString } from "../../common/utils.mjs";

export default {
  name: "Submit URL for Indexing",
  description: "Sends a `URL_UPDATED` or `URL_DELETED` notification for one page to Google's "
    + "**Indexing API**."
    + "\n\n**Purpose.** The Indexing API is a SEPARATE API from Search Console "
    + "(`indexing.googleapis.com`, not the Search Console reporting API). It tells Google that a "
    + "specific page has been published, updated or removed."
    + "\n\n**When to use.** Google supports it ONLY for pages that carry **JobPosting** or "
    + "**BroadcastEvent** (livestream `VideoObject`) structured data. Use it for a job listing that was "
    + "posted, changed or filled, or for a livestream page going live or ending. The default quota is "
    + "**200 notifications per day** per project, and the connected Google account must be a **verified "
    + "owner** of the site the URL belongs to."
    + "\n\n**Do NOT use it to \"request indexing\" for an ordinary page - no API does that.** The "
    + "\"Request indexing\" button in the Search Console UI has no API equivalent, and calling this tool "
    + "for a normal page does not get it crawled sooner; Google ignores or rejects notifications for "
    + "pages without the supported structured data. When a user asks you to request indexing, recrawl or "
    + "\"push\" an ordinary page, say that no API can do it and offer the two real options instead: "
    + "**Submit Sitemap** to have Google re-read the sitemap that contains the page, and **Inspect URLs** "
    + "to check the page's current index status and last crawl time."
    + "\n\n**Returns.** Google's `urlNotificationMetadata` for the URL: the notified `url` plus "
    + "`latestUpdate` / `latestRemove` objects carrying `type` and `notifyTime`. A successful response "
    + "means the notification was accepted, NOT that the page was crawled or indexed."
    + "\n\n**Cross-references.** **Submit Sitemap** (ask Google to re-read a sitemap - the correct tool "
    + "for ordinary pages), **Inspect URLs** (index status, canonical and last crawl time for up to 10 "
    + "URLs), **List Sitemaps** (which sitemaps exist and whether they have errors), **List Sites** (to "
    + "confirm the account owns the property)."
    + "\n\n**Parameter guidance.** `URL for indexing` (the `siteUrl` prop) is the **page URL to notify "
    + "about**, not a property identifier - the prop name is misleading and is kept only for backwards "
    + "compatibility with existing workflows. Pass a full canonical page URL such as "
    + "`https://www.example.com/jobs/paleobotanist`; never pass `sc-domain:example.com` or a bare "
    + "property prefix. `Notification Type` is `URL_UPDATED` when the page was added or changed and "
    + "`URL_DELETED` when the page has been taken down (only send `URL_DELETED` after the page actually "
    + "returns 404 or 410)."
    + "\n\n**Common mistakes.** Passing a property identifier or a site root instead of the page URL; "
    + "using it as a general \"index this page\" button; expecting it to work on a page without "
    + "JobPosting or BroadcastEvent markup; assuming acceptance means the page is indexed; and burning "
    + "the 200/day quota on ordinary pages."
    + "\n\n**Example.** `siteUrl=\"https://www.example.com/jobs/velociraptor-handler\"`, "
    + "`notificationType=\"URL_UPDATED\"` -> `{ urlNotificationMetadata: { url: "
    + "\"https://www.example.com/jobs/velociraptor-handler\", latestUpdate: { url: \"...\", "
    + "type: \"URL_UPDATED\", notifyTime: \"2026-09-02T14:03:11.000Z\" } } }`. For "
    + "`https://www.example.com/` - an ordinary page with no JobPosting or BroadcastEvent markup "
    + "- do not call this tool at all; use **Submit Sitemap** or **Inspect URLs**."
    + "\n\n[See the documentation](https://developers.google.com/search/apis/indexing-api/v3/using-api)",
  key: "google_search_console-submit-url-for-indexing",
  version: "0.0.6",
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
      type: "string",
      label: "URL for indexing",
      description: "The full page URL to notify Google about, e.g. "
        + "`https://www.example.com/jobs/paleobotanist`. This is a PAGE URL, not a Search Console "
        + "property identifier - never pass `sc-domain:example.com` or a bare property prefix here "
        + "(the prop name is kept for backwards compatibility). It must be the canonical URL of a page "
        + "on a site the connected account is a verified owner of, and the page must carry JobPosting "
        + "or BroadcastEvent structured data.",
    },
    notificationType: {
      type: "string",
      label: "Notification Type",
      description: "Type of notification to send to Google",
      options: [
        {
          label: "URL Updated (content has been updated)",
          value: "URL_UPDATED",
        },
        {
          label: "URL Deleted (page no longer exists)",
          value: "URL_DELETED",
        },
      ],
      default: "URL_UPDATED",
    },
  },
  async run({ $ }) {
    const {
      siteUrl, notificationType,
    } = this;
    const trimmedUrl = trimIfString(siteUrl);

    const warnings = [];

    const urlCheck = this.googleSearchConsole.checkIfUrlValid(trimmedUrl);
    if (urlCheck.warnings) {
      warnings.push(...urlCheck.warnings);
    }

    const response = await this.googleSearchConsole.submitUrlForIndexing({
      $,
      data: {
        url: trimmedUrl,
        type: notificationType,
      },
    });

    // Format warnings string if any warnings exist
    const warningsString = warnings.length > 0
      ? `\n- ${warnings.join("\n- ")}`
      : "";

    // Output a summary message and any accumulated warnings
    $.export("$summary", `URL submitted to Google: ${trimmedUrl}${warningsString}`);

    return response;
  },
};
