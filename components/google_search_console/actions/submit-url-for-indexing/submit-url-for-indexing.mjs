import googleSearchConsole from "../../google_search_console.app.mjs";
import { trimIfString } from "../../common/utils.mjs";

export default {
  name: "Submit URL for Indexing",
  description: "Sends a `URL_UPDATED` or `URL_DELETED` notification for one page to Google's "
    + "**Indexing API** (`indexing.googleapis.com`) — a SEPARATE API from Search Console reporting."
    + "\n\n**Use only for pages carrying JobPosting or BroadcastEvent (livestream `VideoObject`) "
    + "structured data** — Google supports nothing else: a job listing that was posted, changed or "
    + "filled, or a livestream page going live or ending. Default quota is **200 notifications per day** "
    + "per project, and the connected account must be a **verified owner** of the site."
    + "\n\n**Do NOT use it to \"request indexing\" an ordinary page — no API does that.** The \"Request "
    + "indexing\" button in the Search Console UI has no API equivalent, and calling this for a normal "
    + "page does not get it crawled sooner; Google ignores or rejects notifications for pages without "
    + "the supported structured data. When a user asks you to request indexing, recrawl or \"push\" an "
    + "ordinary page, say that no API can do it and offer the two real options instead: **Submit "
    + "Sitemap** to have Google re-read the sitemap containing the page, and **Inspect URLs** to check "
    + "its current index status and last crawl time."
    + "\n\n**Returns** Google's `urlNotificationMetadata`: the notified `url` plus `latestUpdate` / "
    + "`latestRemove` objects carrying `type` and `notifyTime`. A success means the notification was "
    + "accepted, NOT that the page was crawled or indexed."
    + "\n\n**Mistakes.** The `siteUrl` prop is the **page URL to notify about**, not a property "
    + "identifier — the name is legacy. Pass a full canonical page URL such as "
    + "`https://www.example.com/jobs/paleobotanist`; never `sc-domain:example.com` or a bare property "
    + "prefix. Send `URL_DELETED` only after the page actually returns 404 or 410. Do not burn the "
    + "200/day quota on ordinary pages."
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
      description: "The full PAGE URL to notify Google about, e.g. "
        + "`https://www.example.com/jobs/paleobotanist` — not a Search Console property identifier, "
        + "so never pass `sc-domain:example.com` or a bare property prefix (the prop name is legacy). "
        + "It must be the canonical URL of a page on a site the connected account is a verified owner "
        + "of, carrying JobPosting or BroadcastEvent structured data.",
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
