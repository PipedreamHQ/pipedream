import {
  axios, ConfigurationError,
} from "@pipedream/platform";

// Canonical public endpoints (matching the open-source `whisper` CLI, the
// reference implementation of this client contract).
//   - graph.whisper.online is the ONE keyed control endpoint (the whisper.agents verb).
//   - rdap.whisper.online is the keyless, anonymous public identity API.
const CONTROL_URL = "https://graph.whisper.online/api/query";
const RDAP_URL = "https://rdap.whisper.online";

// The whisper.security intelligence graph. GRAPH_URL is the same keyed query endpoint as
// CONTROL_URL (one host); FLOW_RUN_URL runs a multi-step catalog flow by slug and streams
// its steps back as Server-Sent Events. Docs pages hang off GRAPH_DOCS_BASE.
const GRAPH_URL = "https://graph.whisper.online/api/query";
const FLOW_RUN_URL = "https://console.whisper.security/api/gallery/run";
const GRAPH_DOCS_BASE = "https://www.whisper.security";

// BEGIN GENERATED: graph catalog (from the whisper catalog SSOT, catalog.json) - do not
// edit by hand. 14 direct procedures (their Cypher runs as-is on /api/query) + 15 multi-
// step flows (run by slug on the console gallery/run endpoint, SSE). `docsUrl` is the docs
// page (GRAPH_DOCS_BASE + the catalog docPath).
const GRAPH_CATALOG = [
  {
    "id": "anycast-dns-root-sovereignty",
    "title": "Anycast DNS-Root Sovereignty",
    "mode": "flow",
    "docsUrl": "https://www.whisper.security/docs/recipes/compliance",
    "inputs": [
      {
        "id": "country",
        "paramName": "country",
        "optional": false,
      },
    ],
    "slug": "anycast-dns-root-sovereignty",
    "params": [
      "instanceType",
    ],
  },
  {
    "id": "attack-path",
    "title": "Attack Path & Connection Finder",
    "mode": "flow",
    "docsUrl": "https://www.whisper.security/docs/recipes/attack-path",
    "inputs": [
      {
        "id": "asset",
        "paramName": "value",
        "optional": false,
      },
      {
        "id": "other",
        "paramName": "other",
        "optional": false,
      },
    ],
    "slug": "attack-path",
    "params": [
      "level",
    ],
  },
  {
    "id": "attack-surface",
    "title": "Attack-Surface Mapper",
    "mode": "flow",
    "docsUrl": "https://www.whisper.security/docs/recipes/pentest-recon",
    "inputs": [
      {
        "id": "domain",
        "paramName": "domain",
        "optional": false,
      },
    ],
    "slug": "attack-surface",
    "params": [
      "level",
    ],
  },
  {
    "id": "bgp-hijack-exposure",
    "title": "BGP Hijack & Routing-Hygiene Audit",
    "mode": "flow",
    "docsUrl": "https://www.whisper.security/docs/recipes/bgp-routing",
    "inputs": [
      {
        "id": "asn",
        "paramName": "value",
        "optional": false,
      },
    ],
    "slug": "bgp-hijack-exposure",
    "params": [],
  },
  {
    "id": "blast-radius",
    "title": "Dependency Blast Radius",
    "mode": "flow",
    "docsUrl": "https://www.whisper.security/docs/recipes/soc",
    "inputs": [
      {
        "id": "asset",
        "paramName": "indicator",
        "optional": false,
      },
    ],
    "slug": "blast-radius",
    "params": [
      "depth",
    ],
  },
  {
    "id": "build-takedown-evidence-package",
    "title": "Takedown Evidence Package",
    "mode": "flow",
    "docsUrl": "https://www.whisper.security/docs/recipes/threat-intel",
    "inputs": [
      {
        "id": "domain",
        "paramName": "domain",
        "optional": false,
      },
    ],
    "slug": "build-takedown-evidence-package",
    "params": [],
  },
  {
    "id": "discover-ai-agent-infrastructure",
    "title": "AI / Agent Infrastructure Discovery",
    "mode": "flow",
    "docsUrl": "https://www.whisper.security/docs/recipes/pentest-recon",
    "inputs": [
      {
        "id": "domain",
        "paramName": "value",
        "optional": false,
      },
    ],
    "slug": "discover-ai-agent-infrastructure",
    "params": [],
  },
  {
    "id": "indicator",
    "title": "Threat Investigation",
    "mode": "flow",
    "docsUrl": "https://www.whisper.security/docs/recipes/soc",
    "inputs": [
      {
        "id": "indicator",
        "paramName": "indicator",
        "optional": false,
      },
    ],
    "slug": "indicator",
    "params": [],
  },
  {
    "id": "indicator-enrichment",
    "title": "Indicator Enrichment",
    "mode": "flow",
    "docsUrl": "https://www.whisper.security/docs/recipes/dns-email",
    "inputs": [
      {
        "id": "domain",
        "paramName": "value",
        "optional": false,
      },
    ],
    "slug": "indicator-enrichment",
    "params": [],
  },
  {
    "id": "infrastructure-mapping",
    "title": "Digital Infrastructure Mapping",
    "mode": "flow",
    "docsUrl": "https://www.whisper.security/docs/recipes/compliance",
    "inputs": [
      {
        "id": "target",
        "paramName": "value",
        "optional": false,
      },
    ],
    "slug": "infrastructure-mapping",
    "params": [
      "level",
    ],
  },
  {
    "id": "map-supply-chain-concentration",
    "title": "Infrastructure Concentration & Resilience",
    "mode": "flow",
    "docsUrl": "https://www.whisper.security/docs/recipes/compliance",
    "inputs": [
      {
        "id": "domain",
        "paramName": "domain",
        "optional": false,
      },
    ],
    "slug": "map-supply-chain-concentration",
    "params": [],
  },
  {
    "id": "nameserver-hijack-dns-consistency",
    "title": "Nameserver & DNS Delegation Audit",
    "mode": "flow",
    "docsUrl": "https://www.whisper.security/docs/recipes/dns-email",
    "inputs": [
      {
        "id": "domain",
        "paramName": "value",
        "optional": false,
      },
    ],
    "slug": "nameserver-hijack-dns-consistency",
    "params": [],
  },
  {
    "id": "route-health",
    "title": "Network & Routing Report",
    "mode": "flow",
    "docsUrl": "https://www.whisper.security/docs/recipes/bgp-routing",
    "inputs": [
      {
        "id": "target",
        "paramName": "target",
        "optional": false,
      },
    ],
    "slug": "route-health",
    "params": [],
  },
  {
    "id": "subdomain-takeover",
    "title": "Subdomain Takeover Detection",
    "mode": "flow",
    "docsUrl": "https://www.whisper.security/docs/recipes/pentest-recon",
    "inputs": [
      {
        "id": "domain",
        "paramName": "value",
        "optional": false,
      },
    ],
    "slug": "subdomain-takeover",
    "params": [],
  },
  {
    "id": "typosquat",
    "title": "Typosquat & Brand-Impersonation Scanner",
    "mode": "flow",
    "docsUrl": "https://www.whisper.security/docs/recipes/brand-protection",
    "inputs": [
      {
        "id": "domain",
        "paramName": "domain",
        "optional": false,
      },
    ],
    "slug": "typosquat",
    "params": [],
  },
  {
    "id": "identify",
    "title": "Vendor / Operator Identity (whisper.identify)",
    "mode": "direct",
    "docsUrl": "https://www.whisper.security/docs/whisper-graph/procedures/identify",
    "inputs": [
      {
        "id": "value",
        "paramName": "v",
        "optional": false,
      },
    ],
    "cypher": "CALL whisper.identify([$v]) YIELD host, vendor_id, canonical_name, category, roles, host_class, band",
  },
  {
    "id": "assess",
    "title": "Threat Posture (whisper.assess)",
    "mode": "direct",
    "docsUrl": "https://www.whisper.security/docs/whisper-graph/procedures",
    "inputs": [
      {
        "id": "value",
        "paramName": "v",
        "optional": false,
      },
    ],
    "cypher": "CALL whisper.assess([$v]) YIELD host, label, band, sub_labels, coverage, evidence",
  },
  {
    "id": "variants",
    "title": "Typosquat Variant Generator (whisper.variants)",
    "mode": "direct",
    "docsUrl": "https://www.whisper.security/docs/whisper-graph/procedures/variants",
    "inputs": [
      {
        "id": "value",
        "paramName": "v",
        "optional": false,
      },
    ],
    "cypher": "CALL whisper.variants($v) YIELD variant, method, exists, confidence",
  },
  {
    "id": "walk",
    "title": "Vendor Attribution Walk (whisper.walk)",
    "mode": "direct",
    "docsUrl": "https://www.whisper.security/docs/whisper-graph/procedures",
    "inputs": [
      {
        "id": "value",
        "paramName": "v",
        "optional": false,
      },
    ],
    "cypher": "CALL whisper.walk($v) YIELD coverage, host, nearest_known_vendors, no_atlas_match, siblings",
  },
  {
    "id": "explain",
    "title": "Threat-Feed Explainer (whisper.explain / explain)",
    "mode": "direct",
    "docsUrl": "https://www.whisper.security/docs/whisper-graph/procedures/explain",
    "inputs": [
      {
        "id": "value",
        "paramName": "v",
        "optional": false,
      },
    ],
    "cypher": "CALL whisper.explain($v) YIELD indicator, score, level, explanation, sources",
  },
  {
    "id": "psl-tldplusone",
    "title": "Registrable Apex (whisper.psl.tldPlusOne)",
    "mode": "direct",
    "docsUrl": "https://www.whisper.security/docs/whisper-graph/procedures/helpers",
    "inputs": [
      {
        "id": "value",
        "paramName": "v",
        "optional": false,
      },
    ],
    "cypher": "CALL whisper.psl.tldPlusOne($v) YIELD apex",
  },
  {
    "id": "psl-affiliation",
    "title": "PSL Private-Suffix Affiliation (whisper.psl.affiliation)",
    "mode": "direct",
    "docsUrl": "https://www.whisper.security/docs/whisper-graph/procedures/helpers",
    "inputs": [
      {
        "id": "value",
        "paramName": "v",
        "optional": false,
      },
    ],
    "cypher": "CALL whisper.psl.affiliation($v) YIELD found, suffix, submitterOrg, submitterLogin, evidenceKind, confidence",
  },
  {
    "id": "origins",
    "title": "CDN-Origin De-cloaker (whisper.origins)",
    "mode": "direct",
    "docsUrl": "https://www.whisper.security/docs/whisper-graph/procedures/origins",
    "inputs": [
      {
        "id": "value",
        "paramName": "v",
        "optional": false,
      },
    ],
    "cypher": "CALL whisper.origins($v) YIELD ip, confidence, methods, asn, asnName, kind",
  },
  {
    "id": "history",
    "title": "WHOIS History Timeline (whisper.history)",
    "mode": "direct",
    "docsUrl": "https://www.whisper.security/docs/whisper-graph/procedures/history",
    "inputs": [
      {
        "id": "value",
        "paramName": "v",
        "optional": false,
      },
    ],
    "cypher": "CALL whisper.history($v)",
  },
  {
    "id": "history-whois",
    "title": "WHOIS History (projection) (whisper.history.whois)",
    "mode": "direct",
    "docsUrl": "https://www.whisper.security/docs/whisper-graph/procedures/history",
    "inputs": [
      {
        "id": "value",
        "paramName": "v",
        "optional": false,
      },
    ],
    "cypher": "CALL whisper.history.whois($v) YIELD queryTime, createDate, updateDate, expiryDate, registrar, registrant, country, nameServers",
  },
  {
    "id": "asset",
    "title": "AS-SET Membership (whisper.asSet)",
    "mode": "direct",
    "docsUrl": "https://www.whisper.security/docs/whisper-graph/procedures",
    "inputs": [
      {
        "id": "value",
        "paramName": "v",
        "optional": false,
      },
    ],
    "cypher": "CALL whisper.asSet($v) YIELD asSetName, memberAsn, sourceRir",
  },
  {
    "id": "lookup-tor-relay",
    "title": "Tor Exit-Relay Lookup (whisper.lookupTorRelay)",
    "mode": "direct",
    "docsUrl": "https://www.whisper.security/docs/whisper-graph/procedures/helpers",
    "inputs": [
      {
        "id": "value",
        "paramName": "v",
        "optional": false,
      },
    ],
    "cypher": "CALL whisper.lookupTorRelay($v) YIELD indicator, found, fingerprint, exitAddressCount, source, ingestedAt",
  },
  {
    "id": "db-schema",
    "title": "Graph Schema Catalog (db.schema)",
    "mode": "direct",
    "docsUrl": "https://www.whisper.security/docs/whisper-graph/schema",
    "inputs": [],
    "cypher": "CALL db.schema()",
  },
  {
    "id": "submit",
    "title": "Submit Observation / Feedback (whisper.submit)",
    "mode": "direct",
    "docsUrl": "https://www.whisper.security/docs/cypher-api",
    "inputs": [
      {
        "id": "kind",
        "paramName": "kind",
        "optional": false,
      },
      {
        "id": "identifierKind",
        "paramName": "identifier_kind",
        "optional": false,
      },
      {
        "id": "value",
        "paramName": "value",
        "optional": false,
      },
      {
        "id": "observationId",
        "paramName": "observation_id",
        "optional": true,
      },
      {
        "id": "confidence",
        "paramName": "confidence",
        "optional": true,
      },
      {
        "id": "firstSeen",
        "paramName": "first_seen",
        "optional": true,
      },
      {
        "id": "provenance",
        "paramName": "provenance",
        "optional": true,
      },
      {
        "id": "query",
        "paramName": "query",
        "optional": true,
      },
      {
        "id": "results",
        "paramName": "results",
        "optional": true,
      },
      {
        "id": "comment",
        "paramName": "comment",
        "optional": true,
      },
      {
        "id": "severity",
        "paramName": "severity",
        "optional": true,
      },
      {
        "id": "v",
        "paramName": "v",
        "optional": true,
      },
    ],
    "map": "whisper.submit",
  },
];
// END GENERATED: graph catalog

export default {
  type: "app",
  app: "whisper",
  propDefinitions: {
    // --- keyless target (verify / RDAP) ---------------------------------------------
    address: {
      type: "string",
      label: "Agent IPv6 Address",
      description: "The Whisper agent's routable IPv6 `/128` address to inspect, e.g. `2a04:2a01:b69a:6717:e3b0:51ff:3bf7:f478`. Whisper agent addresses live in the `2a04:2a01::/32` range (AS219419). Compressed or expanded IPv6 notation is accepted.",
    },
    // --- control-plane (keyed) ------------------------------------------------------
    label: {
      type: "string",
      label: "Name",
      description: "The agent's human name - maps to the server label surfaced by **List Agents** and RDAP, e.g. `scout`.",
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "Optional, opt-in public contact email surfaced in the agent's RDAP record.",
      optional: true,
    },
    listKind: {
      type: "string",
      label: "Kind",
      description: "What to list, confined to your own tenant.",
      options: [
        {
          label: "Agents",
          value: "agents",
        },
        {
          label: "Identities",
          value: "identities",
        },
        {
          label: "DNS Records",
          value: "records",
        },
      ],
      default: "agents",
      optional: true,
    },
    agent: {
      type: "string",
      label: "Agent",
      description: "Select the agent by its id (e.g. `agent-ae3b051ff3bf7f478`) or its `/128` address.",
    },
    connectAgent: {
      type: "string",
      label: "Agent",
      description: "The agent to bind the egress to - its id or `/128` address. Leave blank to reuse your most recently allocated agent.",
      optional: true,
    },
    tier: {
      type: "string",
      label: "Tier",
      description: "The egress mechanism. `SOCKS5` (default) is a hosted SOCKS5/HTTP proxy source-bound to the agent's `/128`; `WireGuard` is a routed tunnel (bring your own client public key); `AnyIP` is server-side source binding of the agent's `/128` on Whisper's edge, with no tunnel or proxy client on your side.",
      options: [
        {
          label: "SOCKS5",
          value: "socks5",
        },
        {
          label: "WireGuard",
          value: "wireguard",
        },
        {
          label: "AnyIP",
          value: "anyip",
        },
      ],
      default: "socks5",
      optional: true,
    },
    publicKey: {
      type: "string",
      label: "WireGuard Public Key",
      description: "Your WireGuard client's base64 public key. Required for the `WireGuard` tier; ignored otherwise.",
      optional: true,
    },
    includeSecrets: {
      type: "boolean",
      label: "Include Secrets",
      description: "Off by default (recommended): the returned config is **stripped of its secrets** - the proxy credential URLs and any private key - so no bearer token lands in your workflow's step exports or logs. Turn on only if a downstream step must consume the credentials directly, and treat the step export as sensitive.",
      default: false,
      optional: true,
    },
    policyDefault: {
      type: "string",
      label: "Default Action",
      description: "The default action for names not on a list. Leave unset (with empty lists) to just **read** the current policy back. Note: setting any policy field replaces the whole policy.",
      options: [
        {
          label: "Allow",
          value: "allow",
        },
        {
          label: "Deny",
          value: "deny",
        },
      ],
      optional: true,
    },
    block: {
      type: "string[]",
      label: "Block List",
      description: "Names to block (max 1000 combined with the allow list), e.g. `ads.example.com`.",
      optional: true,
    },
    allow: {
      type: "string[]",
      label: "Allow List",
      description: "Names to allow, e.g. `api.openai.com`.",
      optional: true,
    },
    bundles: {
      type: "string[]",
      label: "Policy Bundles",
      description: "Named graph-backed policy postures - the geo / category / threat controls. Each entry is a bundle token: `block:tor-exits`, `block:bulletproof`, `block:rpki-invalid`, `block:sanctions`, `block:newly-registered`, or `geo:deny:RU,KP` (ISO-3166 alpha-2 country codes).",
      optional: true,
    },
    logsAgent: {
      type: "string",
      label: "Agent",
      description: "Narrow to one agent (id or `/128` address). Leave blank for the whole tenant.",
      optional: true,
    },
    logsKind: {
      type: "string",
      label: "Kind",
      description: "Which event kind to return (`All` interleaves every kind).",
      options: [
        {
          label: "All",
          value: "all",
        },
        {
          label: "DNS",
          value: "dns",
        },
        {
          label: "Connections",
          value: "conn",
        },
        {
          label: "Allocations",
          value: "alloc",
        },
      ],
      default: "all",
      optional: true,
    },
    from: {
      type: "string",
      label: "From",
      description: "Window start - a relative offset (e.g. `-1h`), epoch-ms, or an RFC-3339 timestamp.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "Window end - a relative offset, epoch-ms, or an RFC-3339 timestamp.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Max rows to return.",
      min: 1,
      max: 10000,
      default: 1000,
      optional: true,
    },
  },
  methods: {
    // ================================================================================
    // Keyless tier - the public, anonymous identity API (rdap.whisper.online).
    // These take NO auth header and work whether or not a Whisper key is connected.
    // ================================================================================
    _rdapUrl() {
      return RDAP_URL;
    },
    async _rdapRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._rdapUrl()}${path}`,
        headers: {
          // Liberal-accept (Postel): the RDAP record is served as application/rdap+json,
          // the others as application/json. Asking only for application/json makes the
          // RDAP endpoint answer 406 Not Acceptable.
          Accept: "application/rdap+json, application/json;q=0.9, */*;q=0.1",
        },
        ...args,
      });
    },
    async verifyIdentity({
      address, ...args
    }) {
      return this._rdapRequest({
        path: "/verify-identity",
        params: {
          ip: address,
        },
        ...args,
      });
    },
    async getRdapRecord({
      address, ...args
    }) {
      return this._rdapRequest({
        path: `/ip/${encodeURIComponent(address)}`,
        ...args,
      });
    },
    async getTransparencyLog({
      address, ...args
    }) {
      return this._rdapRequest({
        path: `/ip/${encodeURIComponent(address)}/transparency`,
        ...args,
      });
    },
    async getInboundLookups({
      address, ...args
    }) {
      return this._rdapRequest({
        path: `/ip/${encodeURIComponent(address)}/lookups`,
        ...args,
      });
    },
    async getEgressIp(args = {}) {
      return this._rdapRequest({
        path: "/egress-ip",
        ...args,
      });
    },

    // ================================================================================
    // Control tier - the keyed control plane (graph.whisper.online). One Cypher verb,
    // whisper.agents({op, args}), POSTed with the account key in the X-API-Key header.
    // ================================================================================
    _controlUrl() {
      return CONTROL_URL;
    },
    _apiKey() {
      return this.$auth?.api_key;
    },
    _requireApiKey() {
      const key = this._apiKey();
      if (!key || `${key}`.trim() === "") {
        throw new ConfigurationError(
          "This action needs your Whisper API key. Connect a Whisper account with your `whisper_live_...` key to unlock the control plane. (The Verify / RDAP actions work without a key.)",
        );
      }
      return key;
    },

    // --- Cypher literal builder (ports the CLI's client/cypher.go exactly) -----------
    // Conservative-emit: a single quote is doubled (openCypher escaping) and a backslash
    // is doubled, so a hostile value can never escape the surrounding '...' literal or map.
    _quoteCypher(s) {
      return `'${String(s).replace(/\\/g, "\\\\")
        .replace(/'/g, "''")}'`;
    },
    _litCypher(v) {
      if (v === null || v === undefined) {
        return "null";
      }
      if (typeof v === "string") {
        return this._quoteCypher(v);
      }
      if (typeof v === "boolean") {
        return v
          ? "true"
          : "false";
      }
      if (typeof v === "number") {
        return String(v);
      }
      if (Array.isArray(v)) {
        return `[${v.map((e) => this._litCypher(e)).join(",")}]`;
      }
      if (typeof v === "object") {
        return this._cypherMap(v);
      }
      return this._quoteCypher(String(v));
    },
    // Keys are emitted in sorted order so the produced query is byte-stable (stable for
    // tests, caches and logs), exactly like the CLI's CypherMap.
    _cypherMap(m) {
      const keys = Object.keys(m)
        .filter((k) => m[k] !== undefined)
        .sort();
      if (keys.length === 0) {
        return "{}";
      }
      return `{${keys.map((k) => `${k}:${this._litCypher(m[k])}`).join(",")}}`;
    },
    _buildAgentsQuery(op, args = {}) {
      const inner = Object.keys(args).length
        ? this._cypherMap(args)
        : "{}";
      return `CALL whisper.agents({op:${this._quoteCypher(op)}, args:${inner}})`;
    },

    // --- Envelope decoding (ports client/envelope.go - liberal in what we accept) ----
    _problemMessage(err, status) {
      if (err) {
        if (err.detail) {
          return err.detail;
        }
        if (err.title) {
          return err.title;
        }
        if (err.type) {
          return err.type;
        }
      }
      return `control plane returned status ${status ?? "(unknown)"}`;
    },
    _recordsFromResult(result) {
      if (result === null || result === undefined) {
        return [];
      }
      if (Array.isArray(result)) {
        return result;
      }
      const cols = result.columns;
      const rows = result.rows;
      if (Array.isArray(cols) && Array.isArray(rows)) {
        return rows.map((row) => {
          if (!Array.isArray(row)) {
            return row;
          }
          const out = {};
          cols.forEach((c, i) => {
            out[c] = row[i];
          });
          return out;
        });
      }
      return [
        result,
      ];
    },
    // Accepts BOTH wire shapes the control plane may return:
    //   A. the live procedure-row table: {columns, rows:[{op,ok,status,result,error}]}
    //   B. the dev-guide flat envelope:  {ok, status, result, error}
    //   + a bare {columns, rows:[[...]]} table, and a bare problem object.
    // Returns the decoded records; throws a clear, helpful error on ok:false (Postel).
    _decodeEnvelope(body, httpStatus) {
      const obj = body;

      // Shape B: an explicit top-level ok flag.
      if (obj && typeof obj === "object" && "ok" in obj) {
        if (obj.ok === false) {
          throw new Error(this._problemMessage(obj.error, obj.status ?? httpStatus));
        }
        return this._recordsFromResult(obj.result);
      }

      // Shapes A & bare-table: a {columns, rows} table.
      if (obj && typeof obj === "object" && Array.isArray(obj.rows)) {
        const rows = obj.rows;
        if (rows.length === 0) {
          return [];
        }
        const first = rows[0];
        // Shape A: each row is a per-op envelope object {op,ok,status,result,error,...}.
        if (first && typeof first === "object" && !Array.isArray(first) && "ok" in first) {
          if (first.ok === false) {
            throw new Error(this._problemMessage(first.error, first.status ?? httpStatus));
          }
          if (first.result !== undefined && first.result !== null) {
            return this._recordsFromResult(first.result);
          }
          return [
            first,
          ];
        }
        // Bare table: positional rows against the outer columns.
        if (Array.isArray(obj.columns)) {
          return this._recordsFromResult(obj);
        }
        return rows;
      }

      // A >=400 transport status with no usable body is itself the fault.
      if (httpStatus >= 400) {
        throw new Error(this._problemMessage(obj, httpStatus));
      }
      // A bare object -> a single record.
      return obj
        ? [
          obj,
        ]
        : [];
    },

    // Run one control op and return the decoded records (throws a helpful error on fail).
    async _agents({
      $ = this, op, args = {},
    }) {
      const apiKey = this._requireApiKey();
      const response = await axios($, {
        method: "POST",
        url: this._controlUrl(),
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        data: {
          query: this._buildAgentsQuery(op, args),
        },
        returnFullResponse: true,
        validateStatus: () => true,
      });
      return this._decodeEnvelope(response.data, response.status);
    },

    // --- control op wrappers --------------------------------------------------------
    async registerAgent({
      $ = this, label, contactEmail,
    }) {
      const args = {
        label,
      };
      if (contactEmail) {
        args.contact_email = contactEmail;
      }
      return this._agents({
        $,
        op: "register",
        args,
      });
    },
    async allocateIdentity({
      $ = this, label, contactEmail,
    }) {
      const args = {
        label,
      };
      if (contactEmail) {
        args.contact_email = contactEmail;
      }
      return this._agents({
        $,
        op: "identity",
        args,
      });
    },
    async connectEgress({
      $ = this, agent, tier, publicKey,
    }) {
      const args = {};
      if (agent) {
        args.agent = agent;
      }
      if (tier) {
        args.tier = tier;
      }
      if (publicKey) {
        args.public_key = publicKey;
      }
      return this._agents({
        $,
        op: "connect",
        args,
      });
    },
    // The connect result embeds live credentials (a bearer inside the proxy URLs, and -
    // on the zero-key WireGuard path - a client private key). Integrations that don't
    // consume them directly must strip them so no secret lands in step exports or logs.
    stripEgressSecrets(record) {
      const secretFields = [
        "http_proxy",
        "https_proxy",
        "connection_string",
        "socks5_endpoint",
        "client_private_key",
        "wireguard_config",
      ];
      const out = {
        ...record,
      };
      const stripped = [];
      for (const f of secretFields) {
        if (out[f] !== undefined && out[f] !== null) {
          delete out[f];
          stripped.push(f);
        }
      }
      if (stripped.length) {
        out.secrets_stripped = stripped;
      }
      return out;
    },
    async getAgent({
      $ = this, agent,
    }) {
      // The control plane keys the lookup by `agent` (an id) or `address` (a /128) -
      // liberal-accept: anything containing a colon is an address.
      const args = String(agent).includes(":")
        ? {
          address: agent,
        }
        : {
          agent,
        };
      return this._agents({
        $,
        op: "agent",
        args,
      });
    },
    async listAgents({
      $ = this, kind,
    }) {
      return this._agents({
        $,
        op: "list",
        args: {
          kind: kind || "agents",
        },
      });
    },
    async setPolicy({
      $ = this, block, allow, bundles, policyDefault,
    }) {
      const args = {};
      if (block?.length) {
        args.block = block;
      }
      if (allow?.length) {
        args.allow = allow;
      }
      if (bundles?.length) {
        args.bundles = bundles;
      }
      if (policyDefault) {
        args.default = policyDefault;
      }
      return this._agents({
        $,
        op: "policy",
        args,
      });
    },
    async getLogs({
      $ = this, agent, kind, from, to, limit,
    }) {
      const args = {};
      if (agent) {
        args.agent = agent;
      }
      if (kind && kind !== "all") {
        args.kind = kind;
      }
      if (from) {
        args.from = from;
      }
      if (to) {
        args.to = to;
      }
      if (limit) {
        args.limit = limit;
      }
      return this._agents({
        $,
        op: "logs",
        args,
      });
    },
    async revokeAgent({
      $ = this, agent,
    }) {
      return this._agents({
        $,
        op: "revoke",
        args: {
          agent,
        },
      });
    },

    // ================================================================================
    // Graph tier - the keyed intelligence graph (graph.whisper.online/api/query). Raw
    // Cypher plus the named catalog recipes: 14 direct procedures run their Cypher as-is
    // and 15 multi-step flows run by slug on the console gallery/run endpoint (SSE). Reuses
    // the same X-API-Key auth as the control plane. Every recipe links its docs page.
    // See https://www.whisper.security/docs/cypher-api
    // ================================================================================
    _graphUrl() {
      return GRAPH_URL;
    },
    _flowRunUrl() {
      return FLOW_RUN_URL;
    },
    _graphDocsBase() {
      return GRAPH_DOCS_BASE;
    },
    // The full recipe catalog (14 direct + 15 flow); each entry carries its docsUrl.
    graphCatalog() {
      return GRAPH_CATALOG;
    },
    _graphEntry(id) {
      const entry = GRAPH_CATALOG.find((e) => e.id === id);
      if (!entry) {
        throw new ConfigurationError(`Unknown graph recipe "${id}".`);
      }
      return entry;
    },
    // Normalise the /api/query reply into {columns, rows, statistics}. Per the contract rows
    // are OBJECTS keyed by column name; a positional-array row (aligned to columns) also
    // decodes, so a liberal server shape still works. Never throws on shape.
    _normalizeGraph(body) {
      if (!body || typeof body !== "object") {
        return {
          columns: [],
          rows: [],
          statistics: null,
        };
      }
      const columns = Array.isArray(body.columns)
        ? body.columns
        : [];
      const rawRows = Array.isArray(body.rows)
        ? body.rows
        : [];
      const rows = rawRows.map((row) => {
        if (Array.isArray(row)) {
          const out = {};
          columns.forEach((c, i) => {
            if (i < row.length) {
              out[c] = row[i];
            }
          });
          return out;
        }
        return row && typeof row === "object"
          ? row
          : {
            value: row,
          };
      });
      return {
        columns,
        rows,
        statistics: body.statistics || null,
      };
    },
    // The one place that talks to the graph query API. POSTs {query, parameters} with the
    // account key in X-API-Key and, on an HTTP>=400 or an RFC-7807 problem body, throws a
    // clear error carrying the server's detail (Postel: a helpful message, never a 500).
    async _graphPost({
      $ = this, query, parameters,
    }) {
      const apiKey = this._requireApiKey();
      const response = await axios($, {
        method: "POST",
        url: this._graphUrl(),
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        data: {
          query,
          parameters: parameters || {},
        },
        returnFullResponse: true,
        validateStatus: () => true,
      });
      const body = response.data;
      const hasTable = body && typeof body === "object"
        && (Array.isArray(body.columns) || Array.isArray(body.rows));
      const problem = body && typeof body === "object"
        && (body.error || (!hasTable && (body.detail || body.title || body.type)));
      if (response.status >= 400 || problem) {
        const e = (body && (body.error || body)) || {};
        throw new Error(
          e.detail || e.title || e.message || e.type
            || `graph query returned status ${response.status}`,
        );
      }
      return this._normalizeGraph(body);
    },
    // Raw Cypher escape hatch: returns the full {columns, rows, statistics}. Bind user input
    // as $parameters (never string-concatenate it) so a query is always injection-safe.
    // @see https://www.whisper.security/docs/cypher-api
    async graphQuery({
      $ = this, cypher, params,
    }) {
      if (!cypher || `${cypher}`.trim() === "") {
        throw new ConfigurationError("Run Cypher needs a Cypher query string.");
      }
      return this._graphPost({
        $,
        query: cypher,
        parameters: params || {},
      });
    },
    // Coerce one catalog value: reject a missing required input with a clear message, and
    // treat an empty/blank value as absent (so an optional field is simply omitted).
    _graphInputValue(entry, input, values) {
      const v = values[input.id];
      const present = v !== undefined && v !== null && `${v}`.trim() !== "";
      if (!present && !input.optional) {
        throw new ConfigurationError(
          `Graph recipe "${entry.id}" needs a value for "${input.id}".`,
        );
      }
      return present
        ? v
        : undefined;
    },
    // Run a named catalog recipe by its id. `values` is keyed by the catalog input/param id;
    // the wire names come from the catalog, so a caller never has to know them. Direct
    // procedures bind their inputs as $parameters and run the catalog Cypher; the submit
    // map-call builds an injection-safe map; flows run by slug on the gallery/run endpoint.
    async runGraphRecipe({
      $ = this, id, values = {},
    }) {
      const entry = this._graphEntry(id);
      if (entry.mode === "flow") {
        const inputs = {};
        const params = {};
        for (const input of entry.inputs) {
          const v = this._graphInputValue(entry, input, values);
          if (v !== undefined) {
            inputs[input.paramName] = v;
          }
        }
        for (const name of (entry.params || [])) {
          const v = values[name];
          if (v !== undefined && v !== null && `${v}`.trim() !== "") {
            params[name] = v;
          }
        }
        return this.runGraphFlow({
          $,
          slug: entry.slug,
          inputs,
          params,
        });
      }
      if (entry.map) {
        return this._runGraphSubmit({
          $,
          entry,
          values,
        });
      }
      const parameters = {};
      for (const input of entry.inputs) {
        const v = this._graphInputValue(entry, input, values);
        if (v !== undefined) {
          parameters[input.paramName] = v;
        }
      }
      const { rows } = await this._graphPost({
        $,
        query: entry.cypher,
        parameters,
      });
      return rows;
    },
    // whisper.submit map-call: each provided field becomes one entry of a Cypher map with
    // its value bound as its own $parameter (injection-safe), keys in SORTED order so the
    // query is byte-stable. Field names are the catalog wire names (validated identifiers).
    async _runGraphSubmit({
      $ = this, entry, values,
    }) {
      const parameters = {};
      const pairs = [];
      for (const input of entry.inputs) {
        const v = this._graphInputValue(entry, input, values);
        if (v === undefined) {
          continue;
        }
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(input.paramName)) {
          throw new ConfigurationError(`Invalid submit field "${input.paramName}".`);
        }
        parameters[input.paramName] = v;
        pairs.push(`${input.paramName}:$${input.paramName}`);
      }
      pairs.sort();
      const query = `CALL ${entry.map}({${pairs.join(",")}})`;
      const { rows } = await this._graphPost({
        $,
        query,
        parameters,
      });
      return rows;
    },
    // Parse an SSE stream body into [{event, data}]; data is JSON-decoded when possible,
    // else kept as the raw string. Never throws on shape.
    _parseSse(text) {
      const events = [];
      const records = String(text)
        .replace(/\r\n/g, "\n")
        .split("\n\n");
      for (const rec of records) {
        if (rec.trim() === "") {
          continue;
        }
        let event = "message";
        const dataLines = [];
        for (const line of rec.split("\n")) {
          if (line.startsWith("event:")) {
            event = line.slice(6).trim();
          } else if (line.startsWith("data:")) {
            dataLines.push(line.slice(5).replace(/^ /, ""));
          }
        }
        let data = dataLines.join("\n");
        try {
          data = JSON.parse(data);
        } catch {
          // not JSON - keep the raw string
        }
        events.push({
          event,
          data,
        });
      }
      return events;
    },
    _firstSseError(text) {
      const errEv = this._parseSse(text)
        .find((ev) => ev.event === "error");
      if (!errEv) {
        return null;
      }
      const d = errEv.data;
      return d && typeof d === "object"
        ? (d.detail || d.message || d.error || null)
        : `${d}`;
    },
    // Run a multi-step flow by slug on the gallery/run endpoint (keyed). POSTs {slug, inputs,
    // params}, consumes the Server-Sent-Events stream (buffered as text) and returns the
    // collected { slug, steps, complete, events }. Flows are multi-step, so the timeout is
    // generous; a liberal server that answers plain JSON is accepted too.
    async runGraphFlow({
      $ = this, slug, inputs = {}, params = {}, timeout = 300000,
    }) {
      const apiKey = this._requireApiKey();
      const response = await axios($, {
        method: "POST",
        url: this._flowRunUrl(),
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
          "Accept": "text/event-stream",
        },
        data: {
          slug,
          inputs,
          params,
        },
        responseType: "text",
        timeout,
        returnFullResponse: true,
        validateStatus: () => true,
      });
      if (response.status >= 400) {
        const b = response.data;
        let detail = `the workflow runner returned status ${response.status}`;
        if (b && typeof b === "object") {
          detail = b.detail || b.message || b.title || detail;
        } else if (typeof b === "string" && b.trim() !== "") {
          detail = this._firstSseError(b) || detail;
        }
        throw new Error(detail);
      }
      const events = typeof response.data === "string"
        ? this._parseSse(response.data)
        : [];
      if (events.length === 0 && response.data && typeof response.data === "object") {
        return {
          slug,
          steps: [],
          complete: response.data,
          events: [],
        };
      }
      const steps = events
        .filter((ev) => ev.event === "step")
        .map((ev) => ev.data);
      const completeEv = events.findLast((ev) => ev.event === "complete");
      const complete = completeEv && typeof completeEv.data === "object"
        ? completeEv.data
        : null;
      const errEv = events.find((ev) => ev.event === "error");
      if (errEv && !complete && steps.length === 0) {
        const d = errEv.data;
        const msg = d && typeof d === "object"
          ? (d.detail || d.message || d.error)
          : `${d}`;
        throw new Error(msg || `graph flow "${slug}" failed on the workflow runner`);
      }
      return {
        slug,
        steps,
        complete,
        events,
      };
    },
    // A friendly one-line summary for either shape a recipe returns (rows or flow steps).
    graphSummary(id, result) {
      if (Array.isArray(result)) {
        return `Ran graph recipe "${id}": ${result.length} row${result.length === 1
          ? ""
          : "s"}`;
      }
      if (result && Array.isArray(result.steps)) {
        return `Ran graph flow "${id}": ${result.steps.length} step${result.steps.length === 1
          ? ""
          : "s"}`;
      }
      return `Ran graph recipe "${id}"`;
    },
  },
};
