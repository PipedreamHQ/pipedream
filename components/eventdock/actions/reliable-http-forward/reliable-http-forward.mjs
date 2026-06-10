import eventdock from "../../eventdock.app.mjs";
import { axios } from "@pipedream/platform";
import {
  isPrivateIpLiteral,
  normalizeHostLiteral,
} from "../../common/ssrf.mjs";

export default {
  key: "eventdock-reliable-http-forward",
  name: "Reliable HTTP Forward",
  description:
    "Send a payload to a destination URL *through EventDock* so the delivery is buffered, retried with exponential backoff, and parked in a DLQ if the destination stays down. Returns the EventDock event id. On the first run for a given destination this creates a reusable EventDock endpoint. [See the docs](https://eventdock.app/docs)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    eventdock,
    destinationUrl: {
      type: "string",
      label: "Destination URL",
      description:
        "The final URL EventDock should deliver the payload to (with retries). For example your app's API or another webhook receiver.",
    },
    payload: {
      type: "object",
      label: "Payload",
      description:
        "The JSON body to forward. EventDock stores it, then attempts delivery to the destination URL, retrying on failure.",
    },
    endpointName: {
      type: "string",
      label: "Endpoint Name",
      description:
        "Optional name for the EventDock endpoint created for this destination. Defaults to the destination host.",
      optional: true,
    },
    debug: {
      type: "boolean",
      label: "Debug",
      description:
        "Include the EventDock ingest URL in this step's output. Off by default — the ingest URL is a capability URL (anyone with it can post events to your endpoint), so it's withheld from step exports unless you explicitly need it.",
      optional: true,
      default: false,
    },
  },
  methods: {
    /**
     * Validate the destination is a well-formed http(s) URL before we do any
     * work. This is a client-side check for fast feedback — the EventDock BACKEND
     * is the authoritative SSRF guard: it re-resolves DNS and re-validates the
     * upstream_url, blocking private/internal/link-local ranges (the same probe
     * logic the platform applies to every webhook destination) regardless of what
     * we send. We do NOT resolve DNS here (it can change between this check and
     * delivery — that's the backend's job), but we DO reject the full set of
     * private/reserved IP *literals* (IPv4 + IPv6) via the ported isPrivateIpLiteral
     * so an obvious 127.0.0.1 / 10.x / 169.254.169.254 / ::1 / fc00:: target is
     * caught immediately rather than slipping past a partial check.
     */
    validateDestinationUrl(destinationUrl) {
      let parsed;
      try {
        parsed = new URL(destinationUrl);
      } catch {
        throw new Error(
          `Destination URL is not a valid URL: ${destinationUrl}`,
        );
      }
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error(
          `Destination URL must use http:// or https:// (got "${parsed.protocol}").`,
        );
      }
      const host = normalizeHostLiteral(parsed.hostname);
      // Reject internal-looking hostnames regardless of DNS.
      const internalName =
        host === "localhost" ||
        host === "ip6-localhost" ||
        host === "ip6-loopback" ||
        host.endsWith(".localhost") ||
        host.endsWith(".internal") ||
        host.endsWith(".local") ||
        host.endsWith(".intranet") ||
        host.endsWith(".corp") ||
        host.endsWith(".home") ||
        host.endsWith(".lan");
      // Reject the full set of private/reserved IP literals (IPv4 + IPv6).
      if (internalName || isPrivateIpLiteral(host)) {
        throw new Error(
          `Destination URL "${host}" looks internal/non-routable. EventDock only delivers to public destinations.`,
        );
      }
      return parsed;
    },
    /**
     * Find an existing, active EventDock endpoint whose upstream_url matches the
     * destination so repeated runs reuse one endpoint instead of creating many.
     * This action always creates `generic` endpoints, so we also require the
     * provider to be `generic` — that way we never reuse a provider-specific
     * endpoint (e.g. a stripe endpoint created by the source for signature
     * verification) that happens to share the same upstream URL, which would
     * apply the wrong verification settings to a plain forward.
     */
    async findEndpointForDestination(destinationUrl) {
      const { endpoints = [] } = await this.eventdock.listEndpoints();
      return endpoints.find(
        (ep) =>
          ep.upstream_url === destinationUrl &&
          ep.status !== "deleted" &&
          (ep.provider || "generic") === "generic",
      );
    },
    async ensureEndpoint(destinationUrl) {
      const existing = await this.findEndpointForDestination(destinationUrl);
      if (existing) {
        return existing;
      }
      const host = this.validateDestinationUrl(destinationUrl).host;
      return this.eventdock.createEndpoint({
        name: this.endpointName || `Pipedream forward → ${host}`,
        upstreamUrl: destinationUrl,
        provider: "generic",
      });
    },
  },
  async run({ $ }) {
    // Client-side sanity check (fast feedback). EventDock's backend is the
    // authoritative SSRF guard and re-validates the destination on its side.
    this.validateDestinationUrl(this.destinationUrl);

    const endpoint = await this.ensureEndpoint(this.destinationUrl);

    // POST the payload to EventDock's ingest URL. EventDock accepts (202),
    // stores it, then handles the reliable delivery to destinationUrl for us.
    const ingestResponse = await axios($, {
      method: "POST",
      url: endpoint.ingest_url,
      headers: { "Content-Type": "application/json" },
      data: this.payload,
    });

    $.export(
      "$summary",
      `Queued reliable delivery to ${this.destinationUrl} (event ${ingestResponse?.event_id ?? "accepted"})`,
    );

    const result = {
      endpoint_id: endpoint.id,
      ...ingestResponse,
    };
    // The ingest URL is a capability URL — only surface it when explicitly
    // requested via the Debug flag, so it doesn't leak into step exports/logs.
    if (this.debug) {
      result.ingest_url = endpoint.ingest_url;
    }
    return result;
  },
};
