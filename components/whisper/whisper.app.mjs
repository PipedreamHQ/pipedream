import { axios, ConfigurationError } from "@pipedream/platform";

// Canonical public endpoints (see docs/packaging/CONTROL_API.md — the client-facing
// contract, reverse-engineered from the `whisper` CLI reference implementation).
//   - graph.whisper.security is the ONE keyed control endpoint (the whisper.agents verb).
//   - rdap.whisper.online is the keyless, anonymous public identity API.
const CONTROL_URL = "https://graph.whisper.security/api/query";
const RDAP_URL = "https://rdap.whisper.online";

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
      description: "The agent's human name — maps to the server label surfaced by **List Agents** and RDAP, e.g. `scout`.",
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
      description: "Named graph-backed policy postures — the geo / category / threat controls. Each entry is a bundle token: `block:tor-exits`, `block:bulletproof`, `block:rpki-invalid`, `block:sanctions`, `block:newly-registered`, or `geo:deny:RU,KP` (ISO-3166 alpha-2 country codes).",
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
      description: "Window start — a relative offset (e.g. `-1h`), epoch-ms, or an RFC-3339 timestamp.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "Window end — a relative offset, epoch-ms, or an RFC-3339 timestamp.",
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
    // Keyless tier — the public, anonymous identity API (rdap.whisper.online).
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
        path: `/ip/${address}`,
        ...args,
      });
    },
    async getTransparencyLog({
      address, ...args
    }) {
      return this._rdapRequest({
        path: `/ip/${address}/transparency`,
        ...args,
      });
    },
    async getInboundLookups({
      address, ...args
    }) {
      return this._rdapRequest({
        path: `/ip/${address}/lookups`,
        ...args,
      });
    },

    // ================================================================================
    // Control tier — the keyed control plane (graph.whisper.security). One Cypher verb,
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
          "This action needs your Whisper API key. Connect a Whisper account with your `whisper_live_…` key to unlock the control plane. (The Verify / RDAP actions work without a key.)",
        );
      }
      return key;
    },

    // --- Cypher literal builder (ports the CLI's client/cypher.go exactly) -----------
    // Conservative-emit: a single quote is doubled (openCypher escaping) and a backslash
    // is doubled, so a hostile value can never escape the surrounding '…' literal or map.
    _quoteCypher(s) {
      return `'${String(s).replace(/\\/g, "\\\\").replace(/'/g, "''")}'`;
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

    // --- Envelope decoding (ports client/envelope.go — liberal in what we accept) ----
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
    // Accepts BOTH wire shapes the control plane returns (CONTROL_API.md section 2):
    //   A. the live procedure-row table: {columns, rows:[{op,ok,status,result,error}]}
    //   B. the dev-guide flat envelope:  {ok, status, result, error}
    //   + a bare {columns, rows:[[…]]} table, and a bare problem object.
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
        // Shape A: each row is a per-op envelope object {op,ok,status,result,error,…}.
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
      // A bare object → a single record.
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
  },
};
