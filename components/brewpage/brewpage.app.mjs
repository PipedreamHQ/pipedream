import { axios } from "@pipedream/platform";
import { getAdapter } from "axios";

const MAX_BYTES = 5 * 1024 * 1024;
const httpAdapter = getAdapter("http");

class PublicationError extends Error {}

function readerLink(value) {
  try {
    const url = new URL(value);
    const reserved = new Set([
      "unlock",
      "www",
      "api",
      "admin",
      "assets",
      "static",
      "cdn",
      "status",
      "health",
      "metrics",
      "grafana",
      "prometheus",
      "monitoring",
      "autoconfig",
      "autodiscover",
      "fe-bounces",
      "account",
    ]);
    const validPath = url.hostname === "brewpage.app"
      ? /^\/[a-z0-9-]{1,32}\/[A-Za-z0-9]{10}\/?$/.test(url.pathname)
      : /^(?:[a-z0-9-]{1,33}-)?[a-z0-9]{10}\.brewpage\.app$/.test(url.hostname)
        && url.pathname === "/";
    if (url.protocol !== "https:" || !validPath || url.username || url.password || url.port
      || url.search || url.hash || reserved.has(url.hostname.split(".")[0])) {
      throw new Error();
    }
    return url.href;
  } catch {
    throw new PublicationError("BrewPage returned an invalid reader link; publication may already exist.");
  }
}

// Minimize before platform axios can export an error response through its context branch.
async function boundedTransport(config) {
  try {
    const response = await httpAdapter(config);
    response.headers = {};
    response.statusText = "";
    return response;
  } catch {
    throw new PublicationError("Publication could not be confirmed; it may already exist. No automatic retry was made.");
  }
}

function readerResult(raw, status, request) {
  if (status !== 200 && status !== 201) {
    throw new PublicationError(`BrewPage returned HTTP ${status}. Publication was not confirmed; no automatic retry was made.`);
  }
  let data;
  try {
    if (typeof raw !== "string" || Buffer.byteLength(raw, "utf8") > 65_536) {
      throw new Error();
    }
    data = JSON.parse(raw);
  } catch {
    throw new PublicationError("BrewPage response could not be read safely; publication may already exist.");
  }
  const expiresAt = data?.expiresAt;
  const validExpiry = typeof expiresAt === "string"
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/.test(expiresAt)
    && Number.isFinite(Date.parse(expiresAt))
    && new Date(expiresAt).toISOString()
      .slice(0, 19) === expiresAt.slice(0, 19);
  const merged = status === 200;
  if (!data || data.access !== request.visibility || !validExpiry
    || (merged && (data.result?.action !== "merged"
      || typeof data.result?.extras?.isOwner !== "boolean"))) {
    throw new PublicationError("BrewPage returned unexpected access, expiry or merge metadata; publication may already exist.");
  }
  return {
    link: readerLink(data.link),
    access: request.visibility,
    expiresAt,
    requestedTtlDays: request.ttlDays,
    merged,
    format: request.format,
    sizeBytes: Buffer.byteLength(request.content, "utf8"),
  };
}

/** @satisfies {import('@pipedream/types').App<{}, {}>} */
export default {
  type: "app",
  app: "brewpage",
  methods: {
    /** Publish reviewed report -> reader metadata; discard capabilities before SDK capture. */
    async publishReport({
      $, content, format, visibility, ttlDays,
    }) {
      if (typeof content !== "string" || !content.trim()
        || Buffer.byteLength(content, "utf8") > MAX_BYTES) {
        throw new Error("Supply a nonblank report of at most 5 MiB UTF-8.");
      }
      if (![
        "html",
        "markdown",
      ].includes(format)) {
        throw new Error("Choose HTML or Markdown explicitly.");
      }
      if (![
        "public",
        "unlisted",
      ].includes(visibility)) {
        throw new Error("Choose Public or Unlisted explicitly.");
      }
      if (!Number.isInteger(ttlDays) || ttlDays < 1 || ttlDays > 30) {
        throw new Error("Choose a retention of 1–30 whole days.");
      }
      const request = {
        content,
        format,
        visibility,
        ttlDays,
      };
      try {
        return await axios($, {
          method: "POST",
          url: "https://brewpage.app/api/html",
          params: {
            ttl: String(ttlDays),
            verbatim: "true",
            ns: visibility === "public"
              ? "public"
              : undefined,
          },
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "brewpage-pipedream/0.0.1 (+https://brewpage.app)",
          },
          data: {
            content,
            format,
          },
          timeout: 60_000,
          signal: AbortSignal.timeout(60_000),
          maxRedirects: 0,
          maxBodyLength: 32 * 1024 * 1024,
          maxContentLength: 65_536,
          proxy: false,
          adapter: boundedTransport,
          validateStatus: () => true,
          responseType: "text",
          transformResponse: [
            (raw, _headers, status) => readerResult(raw, status, request),
          ],
          debug: false,
          returnFullResponse: false,
        });
      } catch (error) {
        if (error instanceof PublicationError) {
          throw error;
        }
        throw new Error("Publication could not be confirmed; it may already exist. No automatic retry was made.");
      }
    },
  },
};
