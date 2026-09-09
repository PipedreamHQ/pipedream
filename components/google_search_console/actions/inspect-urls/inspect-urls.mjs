import { ConfigurationError } from "@pipedream/platform";
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
  description: "Returns Google's index status, canonical selection and crawl state for 1-10 URLs of "
    + "one Search Console property in a single call. This is the API behind the URL Inspection tool in "
    + "the Search Console UI."
    + "\n\n**Use for** \"is this page indexed?\", \"when did Google last crawl it?\", \"does Google's "
    + "canonical match the one I declared?\", \"why is this URL missing from search?\", and batch health "
    + "checks after a deploy or migration — pass every URL you care about in ONE call, not one call per "
    + "URL."
    + "\n\n**Not for backlinks.** Search Console's Links report has no API at all. `referringUrls` here "
    + "is only a small sample of pages Google happened to discover the URL from — not a backlink "
    + "profile — so when asked for backlinks, call no Search Console tool and say plainly that the "
    + "links report is not available through the API. The result also carries no Core Web Vitals or "
    + "page-experience data. And if the user asks to \"request indexing\" or force a recrawl of an "
    + "ordinary page, do not run this tool (or any other) on your own initiative: explain that no API "
    + "does that, OFFER this index-status check or a sitemap resubmission via **Submit Sitemap**, and "
    + "wait for them to choose."
    + "\n\n**Returns** `{ results: [...], summary: { total, indexed, not_indexed, errors } }`, one row "
    + "per URL in the same order as `inspectionUrls`. Reading the rows:"
    + "\n- `verdict` is `PASS` (indexed), `NEUTRAL` (known but not indexed, or unknown to Google), "
    + "`FAIL` or `PARTIAL`. A URL Google has never seen returns `NEUTRAL` with a `coverageState` like "
    + "`\"URL is unknown to Google\"` — that is a valid answer, not an error."
    + "\n- `canonical_mismatch` is `true` when `googleCanonical` and `userCanonical` are both present "
    + "and differ, `false` when they match, `null` when either is missing."
    + "\n- `referringUrls` is truncated to the first 5; `referring_url_count` is the full count."
    + "\n- `error` is `null` on success and a message when that single URL failed — one bad URL never "
    + "aborts the batch. In `summary`, `indexed` counts `PASS` rows, `errors` counts rows with an "
    + "`error`, and `not_indexed` is everything else."
    + "\n- The raw API result is attached per row as `full_result` ONLY when `includeFullResult` is "
    + "true. Leave it off unless the user asks for the complete raw result: it is large and mostly "
    + "rich-results and AMP detail."
    + "\n\n**Mistakes.** A path such as `/about` is not accepted — send full absolute URLs that live "
    + "under `siteUrl`. Each inspection takes Google roughly 5-10 seconds, so a 10-URL batch runs about "
    + "20 seconds; that is normal, not a hang. Quota is 2,000 inspections per day AND 600 per minute "
    + "per property, and a quota error does not say which was hit. Requires `siteOwner` or "
    + "`siteFullUser` — a `siteRestrictedUser` gets 403, and so does a mismatched `siteUrl` (URLs "
    + "outside the property, a missing trailing slash, `sc-domain:` versus URL-prefix confusion), so "
    + "copy the identifier verbatim from **List Sites**."
    + "\n\n**Example.** `siteUrl=\"sc-domain:example.com\"`, "
    + "`inspectionUrls=[\"https://www.example.com/\"]` -> `results[0]` has `verdict: \"PASS\"`, "
    + "`coverageState: \"Submitted and indexed\"`, `googleCanonical: \"https://www.example.com/\"`, "
    + "`userCanonical: \"https://example.com/\"` and `canonical_mismatch: true` — Google indexed the "
    + "www URL even though the page declares the non-www one."
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
      description: "Exact property identifier as returned by **List Sites**, copied verbatim. Every URL in `inspectionUrls` must belong to it, or the call returns 403 \"User does not have sufficient permission for site\".",
    },
    inspectionUrls: {
      type: "string[]",
      label: "URLs to Inspect",
      description: "1-10 full absolute URLs to inspect, e.g. `[\"https://www.example.com/\", \"https://www.example.com/pricing\"]`. Each must live under the property given in `siteUrl`; paths alone (`/pricing`) are rejected. Batch the URLs into this one call rather than calling the action once per URL. On a quota failure wait a minute before retrying, and only then assume the 2,000-per-day cap rather than the 600-per-minute one.",
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "BCP-47 language code (e.g. `en-US`, `fr`, `pt-BR`) for the human-readable strings in the result, such as `coverageState`. Defaults to `en-US`; it changes no verdicts or data.",
      optional: true,
      default: "en-US",
    },
    includeFullResult: {
      type: "boolean",
      label: "Include Full Result",
      description: "When `true`, attach the untrimmed API `inspectionResult` for each URL as `full_result`. Defaults to `false` because that payload is large and mostly rich-results and AMP detail, and the curated fields already answer index-status, canonical and crawl questions. Set it `true` only when the user asks for the complete or raw inspection result.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const {
      siteUrl, inspectionUrls, languageCode, includeFullResult,
    } = this;

    const trimmedSiteUrl = trimIfString(siteUrl);

    const urls = (Array.isArray(inspectionUrls)
      ? inspectionUrls
      : [
        inspectionUrls,
      ])
      .map(trimIfString)
      .filter((url) => typeof url === "string" && url !== "");

    if (urls.length === 0) {
      throw new ConfigurationError("No URLs to inspect. Pass 1-10 full absolute URLs in `inspectionUrls`, e.g. [\"https://www.example.com/\"].");
    }

    if (urls.length > MAX_URLS) {
      throw new ConfigurationError(`Too many URLs: ${urls.length} given, but this action inspects at most ${MAX_URLS} per call. Split the list into batches of ${MAX_URLS} or fewer.`);
    }

    const results = await mapWithConcurrency(urls, CONCURRENCY, async (url) => {
      try {
        const response = await this.googleSearchConsole.inspectUrl({
          $,
          data: {
            inspectionUrl: url,
            siteUrl: trimmedSiteUrl,
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
