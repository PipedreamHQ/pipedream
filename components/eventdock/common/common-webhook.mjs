import eventdock from "../eventdock.app.mjs";

/**
 * Shared base for EventDock webhook sources.
 *
 * On `activate()` it creates an EventDock endpoint whose upstream destination is
 * this source's Pipedream HTTP endpoint (`this.http.endpoint`). Your provider
 * points at the EventDock ingest URL; EventDock buffers, retries, de-dupes, and
 * delivers reliable events to this source, which emits them into your workflow.
 *
 * On `deactivate()` it soft-deletes the EventDock endpoint so it doesn't leak
 * against your plan's endpoint limit.
 */
export default {
  props: {
    eventdock,
    // `http` gives us a stable public URL to register as the EventDock upstream.
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const provider = this.provider || "generic";
      const upstreamUrl = this.http.endpoint;

      // Idempotent activate: a redeploy / re-activate reuses an existing,
      // non-deleted endpoint already pointing at this source's URL instead of
      // orphaning the old one and creating a fresh duplicate. Mirrors the n8n
      // node's checkExists/find-or-create lifecycle.
      //
      // CRITICAL (verification correctness): we only reuse an endpoint when the
      // upstream_url AND the provider match. Matching on upstream_url alone would
      // silently reuse an endpoint whose `provider` (and therefore its signature-
      // verification behaviour) is stale after the user switched providers — e.g.
      // flipping stripe -> github but still verifying against the old scheme. The
      // EventDock API treats `provider` as immutable (no PATCH path for it), so a
      // provider change means: create a fresh endpoint, then soft-delete the
      // stale one to avoid orphan buildup against the plan's endpoint limit.
      let endpoint = await this._findReusableEndpoint(upstreamUrl, provider);
      if (endpoint) {
        // Same upstream + same provider: reuse — but push the (possibly rotated)
        // provider_secret so verification settings never go stale. The list API
        // never returns the secret, so we can't diff it; PATCHing is the safe,
        // idempotent way to guarantee the current secret is in effect. (No-op for
        // the generic provider, which has no signature verification.)
        if (provider !== "generic" && this.providerSecret) {
          await this.eventdock.updateEndpoint({
            endpointId: endpoint.id,
            provider_secret: this.providerSecret,
          });
        }
      } else {
        // Soft-delete any stale endpoint that points at the SAME upstream but a
        // DIFFERENT provider, so we don't accumulate orphans on provider switch.
        await this._deleteStaleUpstreamEndpoints(upstreamUrl, provider);
        endpoint = await this.eventdock.createEndpoint({
          name: this.getEndpointName(),
          upstreamUrl,
          provider,
          providerSecret: this.providerSecret,
        });
      }

      this._setEndpointId(endpoint.id);
      this._setIngestUrl(endpoint.ingest_url);
      // Log the endpoint id only — the ingest URL is a capability URL (anyone
      // with it can post events), so we don't print it to the deploy logs.
      console.log(
        `EventDock endpoint ready: ${endpoint.id}. Find its ingest URL in the EventDock dashboard to point your ${provider} webhooks at.`,
      );
    },
    async deactivate() {
      const endpointId = this._getEndpointId();
      if (!endpointId) {
        return;
      }
      try {
        await this.eventdock.deleteEndpoint({ endpointId });
        console.log(`EventDock endpoint deleted: ${endpointId}`);
      } catch (err) {
        // Don't block teardown if the endpoint was already removed.
        console.log(`Could not delete EventDock endpoint ${endpointId}: ${err?.message ?? err}`);
      } finally {
        // Clear the stored id (and cached ingest URL) so a later re-activate
        // doesn't think a now-deleted endpoint still exists.
        this._clearEndpointId();
      }
    },
  },
  methods: {
    _getEndpointId() {
      return this.db.get("endpointId");
    },
    _setEndpointId(id) {
      this.db.set("endpointId", id);
    },
    _setIngestUrl(url) {
      this.db.set("ingestUrl", url);
    },
    _clearEndpointId() {
      this.db.set("endpointId", undefined);
      this.db.set("ingestUrl", undefined);
    },
    /**
     * List EventDock endpoints and return the first non-deleted one whose
     * upstream_url AND provider both match, or undefined. Matching on BOTH (not
     * upstream_url alone) is what keeps activate() from reusing an endpoint with
     * stale verification settings after a provider switch.
     */
    async _findReusableEndpoint(upstreamUrl, provider) {
      const { endpoints = [] } = await this.eventdock.listEndpoints();
      return endpoints.find(
        (ep) =>
          ep.upstream_url === upstreamUrl &&
          ep.status !== "deleted" &&
          (ep.provider || "generic") === provider,
      );
    },
    /**
     * Soft-delete any non-deleted endpoint that points at the same upstream URL
     * but a DIFFERENT provider. Called before creating a fresh endpoint on a
     * provider switch so stale endpoints don't pile up against the plan limit.
     */
    async _deleteStaleUpstreamEndpoints(upstreamUrl, provider) {
      const { endpoints = [] } = await this.eventdock.listEndpoints();
      const stale = endpoints.filter(
        (ep) =>
          ep.upstream_url === upstreamUrl &&
          ep.status !== "deleted" &&
          (ep.provider || "generic") !== provider,
      );
      for (const ep of stale) {
        try {
          await this.eventdock.deleteEndpoint({ endpointId: ep.id });
        } catch (err) {
          // Best-effort cleanup — don't block activation if a stale endpoint
          // can't be removed (e.g. already gone / transient API error).
          console.log(
            `Could not soft-delete stale EventDock endpoint ${ep.id}: ${err?.message ?? err}`,
          );
        }
      }
    },
    getEndpointName() {
      return `Pipedream · EventDock ${this.provider || "generic"} source`;
    },
    /**
     * Builds the EventDock metadata object from the X-EventDock-* headers that
     * the delivery worker attaches to every forwarded request.
     */
    getEventDockMeta(headers = {}) {
      // Pipedream lower-cases header keys.
      const attempt = headers["x-eventdock-attempt"];
      const attemptNum = attempt !== undefined ? Number(attempt) : null;
      return {
        eventId: headers["x-eventdock-event-id"] ?? null,
        attempt: attemptNum,
        ingestTimestamp:
          headers["x-eventdock-timestamp"] !== undefined
            ? Number(headers["x-eventdock-timestamp"])
            : null,
        correlationId: headers["x-eventdock-correlation-id"] ?? null,
        isRetry: attemptNum !== null ? attemptNum > 0 : null,
      };
    },
    generateMeta(meta) {
      // Use the EventDock event id as the dedupe key when present so a retried
      // delivery of the same event never double-fires the workflow.
      const id = meta.eventId ?? `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const summary = meta.eventId
        ? `Event ${meta.eventId}${meta.isRetry ? ` (retry #${meta.attempt})` : ""}`
        : "EventDock delivery";
      return {
        id,
        summary,
        ts: meta.ingestTimestamp ?? Date.now(),
      };
    },
  },
};
