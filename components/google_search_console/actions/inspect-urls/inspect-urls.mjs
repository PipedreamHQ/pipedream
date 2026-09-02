import googleSearchConsole from "../../google_search_console.app.mjs";
import { trimIfString } from "../../common/utils.mjs";

const MAX_URLS = 10;
const CONCURRENCY = 5;
const MAX_REFERRING_URLS = 5;

/**
 * Minimal inline worker pool. Runs `worker` over `items` with at most `limit`
 * calls in flight at any moment and returns the results in input order.
 */
async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;

  const runNext = async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  };

  const runners = [];
  const poolSize = Math.min(limit, items.length);
  for (let i = 0; i < poolSize; i++) {
    runners.push(runNext());
  }
  await Promise.all(runners);

  return results;
}

function buildRow({
  url, inspectionResult, error, includeFullResult,
}) {
  const indexStatus = inspectionResult?.indexStatusResult ?? {};
  const googleCanonical = indexStatus.googleCanonical ?? null;
  const userCanonical = indexStatus.userCanonical ?? null;
  const referringUrls = indexStatus.referringUrls ?? [];

  const row = {
    url,
    verdict: indexStatus.verdict ?? null,
    coverageState: indexStatus.coverageState ?? null,
    indexingState: indexStatus.indexingState ?? null,
    robotsTxtState: indexStatus.robotsTxtState ?? null,
    pageFetchState: indexStatus.pageFetchState ?? null,
    lastCrawlTime: indexStatus.lastCrawlTime ?? null,
    crawledAs: indexStatus.crawledAs ?? null,
    googleCanonical,
    userCanonical,
    canonical_mismatch: (googleCanonical && userCanonical)
      ? googleCanonical !== userCanonical
      : null,
    referring_url_count: referringUrls.length,
    referringUrls: referringUrls.slice(0, MAX_REFERRING_URLS),
    sitemaps: indexStatus.sitemap ?? [],
    rich_results_verdict: inspectionResult?.richResultsResult?.verdict ?? null,
    inspectionResultLink: inspectionResult?.inspectionResultLink ?? null,
    error: error ?? null,
  };

  if (includeFullResult) {
    row.full_result = inspectionResult ?? null;
  }

  return row;
}

export default {
  name: "Inspect URLs",
  description: "Returns Google's index status, canonical selection and crawl state for 1-10 URLs "
    + "of one Search Console property, in a single call."
    + "\n\n**Purpose.** This is the API behind the URL Inspection tool in the Search Console UI. "
    + "For each URL it reports whether Google has indexed it, why or why not, when it was last "
    + "crawled and with which crawler, the canonical Google selected versus the canonical the page "
    + "declares, which sitemaps reference it, and whether rich results were detected."
    + "\n\n**When to use.** \"Is this page indexed?\", \"when did Google last crawl it?\", \"does "
    + "Google's canonical match the one I declared?\", \"why is this URL missing from search?\", and "
    + "batch health checks after a deploy or a migration - pass every URL you care about in ONE call "
    + "instead of calling the tool once per URL."
    + "\n\n**Returns.** `{ results: [...], summary: { total, indexed, not_indexed, errors } }`. Each "
    + "row is `{ url, verdict, coverageState, indexingState, robotsTxtState, pageFetchState, "
    + "lastCrawlTime, crawledAs, googleCanonical, userCanonical, canonical_mismatch, "
    + "referring_url_count, referringUrls, sitemaps, rich_results_verdict, inspectionResultLink, "
    + "error }`, in the same order as `inspectionUrls`. `verdict` is `PASS` (indexed), `NEUTRAL` "
    + "(known but not indexed, or unknown to Google), `FAIL` or `PARTIAL`. `canonical_mismatch` is "
    + "`true` when both canonicals are present and differ, `false` when they match, and `null` when "
    + "either is missing. `referringUrls` is truncated to the first 5 while `referring_url_count` is "
    + "the full count. These are sample referrers Google used to find the page, not a backlink "
    + "report. `error` is `null` on success and a message string when that single URL failed: "
    + "one bad URL never aborts the batch. In `summary`, `indexed` counts `verdict: \"PASS\"` rows, "
    + "`errors` counts rows with an `error`, and `not_indexed` is everything else. The raw API result "
    + "is attached per row as `full_result` ONLY when `includeFullResult` is true - leave it off "
    + "unless the user asks for the complete raw result, because it is large and mostly rich-results "
    + "and AMP detail."
    + "\n\n**Cross-references.** Get the exact `siteUrl` and confirm your permission level with "
    + "**List Sites**. Use **Query Search Analytics** to find the pages worth inspecting (for example "
    + "the pages with impressions but no clicks). Use **Submit Sitemap** to ask Google to re-read a "
    + "sitemap - that is the supported way to nudge crawling, because there is no API to request "
    + "indexing of a single ordinary page. If the user asks to \"request indexing\" or force a "
    + "recrawl of an ordinary page, do not run this tool (or any other) on your own initiative: "
    + "explain that no API does that, OFFER this index-status check or a sitemap resubmission, and "
    + "wait for the user to choose."
    + "\n\n**Parameter guidance.** `inspectionUrls` takes full absolute URLs (scheme included) that "
    + "live under the property named in `siteUrl`; a path such as `/about` is not accepted. Send "
    + "several URLs in one call rather than one call per URL. The limit is 10 URLs per call - split "
    + "longer lists into batches. Each inspection takes Google roughly 5-10 seconds, so a 10-URL "
    + "batch runs about 20 seconds — that is normal, not a hang. Quota is 2,000 inspections per "
    + "day and 600 per minute per property, and quota errors do not say which of the two was hit. "
    + "`languageCode` (BCP-47, default `en-US`) only changes the language of the human-readable "
    + "strings in the result."
    + "\n\n**Common mistakes.** Do NOT use this tool for backlinks, \"who links to my site\", or "
    + "the Links report: Search Console's Links report has no API at all, and `referringUrls` here "
    + "is only a small sample of pages Google happened to discover the URL from — not a backlink "
    + "profile. When asked for backlinks, call no Search Console tool and say plainly that the "
    + "links report is not available through the API. The result also does NOT include Core Web "
    + "Vitals or page-experience data. A URL Google has never seen returns "
    + "`verdict: \"NEUTRAL\"` with a `coverageState` like "
    + "`\"URL is unknown to Google\"`; that is a valid answer, not an error. This tool requires "
    + "`siteOwner` or `siteFullUser` permission - a `siteRestrictedUser` gets 403. A wrong or "
    + "mismatched `siteUrl` (URLs that do not belong to that property, a missing trailing slash, or "
    + "`sc-domain:` versus URL-prefix confusion) also returns 403 \"User does not have sufficient "
    + "permission for site\", so copy the identifier verbatim from **List Sites**. "
    + "`mobileUsabilityResult` is deprecated by Google and is not surfaced here."
    + "\n\n**Example.** `siteUrl=\"sc-domain:example.com\"`, "
    + "`inspectionUrls=[\"https://www.example.com/\"]` -> `results[0]` has "
    + "`verdict: \"PASS\"`, `coverageState: \"Submitted and indexed\"`, "
    + "`googleCanonical: \"https://www.example.com/\"`, "
    + "`userCanonical: \"https://example.com/\"`, `canonical_mismatch: true` (Google indexed "
    + "the www URL even though the page declares the non-www one), and a `lastCrawlTime` such as "
    + "`\"2026-08-28T04:12:33Z\"`; `summary` is "
    + "`{ total: 1, indexed: 1, not_indexed: 0, errors: 0 }`."
    + "\n\n[See the documentation](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect)",
  key: "google_search_console-inspect-urls",
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
      description: "Exact property identifier as returned by **List Sites** — `sc-domain:example.com` for a domain property, or a URL-prefix such as `https://www.example.com/` (trailing slash; scheme and subdomain must match exactly). Copy it verbatim; never construct it. Every URL in `inspectionUrls` must belong to this property, otherwise the call returns 403 \"User does not have sufficient permission for site\". Inspection requires `siteOwner` or `siteFullUser` on the property.",
    },
    inspectionUrls: {
      type: "string[]",
      label: "URLs to Inspect",
      description: "1-10 full absolute URLs to inspect, e.g. `[\"https://www.example.com/\", \"https://www.example.com/pricing\"]`. Each must live under the property given in `siteUrl`; paths alone (`/pricing`) are rejected. Batch the URLs into this one call rather than calling the action once per URL. Quota is 2,000 inspections per day AND 600 per minute per property; a quota error does not say which of the two limits was hit, so on a quota failure wait a minute before retrying and only then assume the daily cap.",
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "BCP-47 language code (e.g. `en-US`, `fr`, `pt-BR`) for the human-readable strings in the result, such as `coverageState`. Defaults to `en-US`. It does not change the verdicts or any other data.",
      optional: true,
      default: "en-US",
    },
    includeFullResult: {
      type: "boolean",
      label: "Include Full Result",
      description: "When `true`, attach the untrimmed API `inspectionResult` for each URL as `full_result` (rich results detail, AMP result, and everything else Google returns). Defaults to `false` because that payload is large and mostly rich-results and AMP detail; the curated fields already answer index-status, canonical and crawl questions. Set it to `true` only when the user asks for the complete or raw inspection result.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const {
      siteUrl, inspectionUrls, languageCode, includeFullResult,
    } = this;

    const urls = (Array.isArray(inspectionUrls)
      ? inspectionUrls
      : [
        inspectionUrls,
      ])
      .map(trimIfString)
      .filter((url) => typeof url === "string" && url !== "");

    if (urls.length === 0) {
      throw new Error("No URLs to inspect. Pass 1-10 full absolute URLs in `inspectionUrls`, e.g. [\"https://www.example.com/\"].");
    }

    if (urls.length > MAX_URLS) {
      throw new Error(`Too many URLs: ${urls.length} given, but this action inspects at most ${MAX_URLS} per call. Split the list into batches of ${MAX_URLS} or fewer.`);
    }

    const results = await mapWithConcurrency(urls, CONCURRENCY, async (url) => {
      try {
        const response = await this.googleSearchConsole.inspectUrl({
          $,
          data: {
            inspectionUrl: url,
            siteUrl,
            languageCode,
          },
        });
        return buildRow({
          url,
          inspectionResult: response?.inspectionResult,
          includeFullResult,
        });
      } catch (error) {
        // The contract is one row per URL: a single failure is reported in that
        // row's `error` and must never abort the rest of the batch.
        return buildRow({
          url,
          error: error.response?.data?.error?.message || error.message,
          includeFullResult,
        });
      }
    });

    const total = results.length;
    const indexed = results.filter((row) => row.verdict === "PASS").length;
    const errors = results.filter((row) => row.error !== null).length;
    const notIndexed = total - indexed - errors;

    const errorSuffix = errors > 0
      ? `, ${errors} error${errors === 1
        ? ""
        : "s"}`
      : "";

    $.export("$summary", `Inspected ${total} URL${total === 1
      ? ""
      : "s"}: ${indexed} indexed, ${notIndexed} not indexed${errorSuffix}`);

    return {
      results,
      summary: {
        total,
        indexed,
        not_indexed: notIndexed,
        errors,
      },
    };
  },
};
