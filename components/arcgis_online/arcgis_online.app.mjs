import { axios } from "@pipedream/platform";

const PORTAL_REST = "https://www.arcgis.com/sharing/rest";
const PAGE_SIZE = 100;
const MAX_TITLE_PAGES = 5;
const PORTAL_ITEM_ID_RE = /^[a-f0-9]{32}$/i;

export default {
  type: "app",
  app: "arcgis_online",
  propDefinitions: {
    featureService: {
      type: "string",
      label: "Feature Service",
      description:
        "The Feature Service to use: a 32-character portal item ID (e.g. \"0123456789abcdef0123456789abcdef\"), a full FeatureServer URL (e.g. \"https://services.arcgis.com/.../FeatureServer/0\"), or a service title that matches search results",
      useQuery: true,
      async options({
        query,
        prevContext,
      }) {
        return this.searchFeatureServices({
          $: this,
          query,
          prevContext,
        });
      },
    },
    layerId: {
      type: "string",
      label: "Layer",
      description:
        "Layer in the Feature Service: numeric layer id as a string (e.g. \"0\" or \"1\") or layer name (e.g. \"Parcels\"); names are matched case-insensitively",
      async options({
        featureService,
        editableOnly,
      }) {
        if (!featureService) {
          return [];
        }
        return this.listLayerNameOptions({
          $: this,
          featureService,
          editableOnly,
        });
      },
    },
    targetLayerIds: {
      type: "string[]",
      label: "Target Layers",
      description:
        "Layers in the same Feature Service: each entry is a numeric layer id as a string and/or a layer name (e.g. [\"0\", \"Parcels\", \"2\"]); names are matched case-insensitively",
      async options({ featureService }) {
        if (!featureService) {
          return [];
        }
        return this.listLayerNameOptions({
          $: this,
          featureService,
        });
      },
    },
    fieldName: {
      type: "string",
      label: "Field Name",
      description:
        "Layer attribute field name (e.g. \"OBJECTID\", \"CITY_NAME\"). Names are case-sensitive and must match the layer schema",
      async options({
        featureService,
        layerId,
        editableOnly,
      }) {
        if (!featureService || !layerId) {
          return [];
        }
        return this.listLayerFieldOptions({
          $: this,
          featureService,
          layerId,
          editableOnly,
        });
      },
    },
    objectId: {
      type: "string",
      label: "Object ID",
      description:
        "Feature OBJECTID: a numeric identifier, as a string (e.g. \"12345\")",
      async options({
        featureService,
        layerId,
        prevContext,
        editableOnly,
      }) {
        if (!featureService || !layerId) {
          return [];
        }
        return this.listObjectIdOptions({
          $: this,
          featureService,
          layerId,
          prevContext,
          editableOnly,
        });
      },
    },
  },
  methods: {
    /**
     * Authenticated request to ArcGIS REST endpoints.
     *
     * @param {object} opts
     * @param {object} opts.$ - Pipedream execution context
     * @param {string} opts.baseUrl - Host origin
     * @param {string} opts.url - Path beginning with `/` or relative
     * @param {string} [opts.method="GET"]
     * @param {object} [opts.params] - URL query parameters
     * @param {string|object} [opts.data] - Request body
     * @param {object} [opts.headers]
     * @returns {Promise<object>} Parsed JSON response body
     */
    async _request({
      $ = this, baseUrl, url, method = "GET", params, data, headers = {},
    }) {
      const token = this.$auth?.oauth_access_token;
      if (!token) {
        throw new Error(
          "ArcGIS Online OAuth access token is missing. Connect an account.",
        );
      }
      const origin = String(baseUrl).replace(/\/+$/, "");
      const path = url.startsWith("/")
        ? url
        : `/${url}`;
      const body = await axios($, {
        url: `${origin}${path}`,
        method,
        params,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
          ...headers,
        },
      });
      if (body && typeof body === "object" && body.error != null) {
        const e = body.error;
        const code = e.code != null
          ? ` [${e.code}]`
          : "";
        const msg = e.message || JSON.stringify(e);
        throw new Error(`ArcGIS error${code}: ${msg}`);
      }
      return body;
    },

    /**
     * Get the authenticated user's username and org ID from the portal.
     *
     * @param {object} opts
     * @param {object} opts.$ - Pipedream execution context
     * @returns {Promise<{ username: string, orgId: string }>}
     */
    async _getCurrentUser({ $ }) {
      if (this._cachedUser) {
        return this._cachedUser;
      }
      const data = await this._request({
        $,
        baseUrl: PORTAL_REST,
        url: "/community/self",
        params: {
          f: "json",
        },
      });

      if (data.username == null || data.username === "") {
        throw new Error("No username found for current user");
      }
      if (data.orgId == null || data.orgId === "") {
        throw new Error("No orgId found for current user");
      }

      this._cachedUser = {
        username: data.username,
        orgId: data.orgId,
      };
      return this._cachedUser;
    },

    /**
     * Check if layer metadata indicates update/edit capability.
     *
     * @param {object} meta - Layer metadata JSON
     * @returns {boolean}
     */
    _layerMetadataSupportsUpdates(meta) {
      if (!meta || typeof meta !== "object") {
        return false;
      }
      if (meta.supportsEditing === false) {
        return false;
      }
      const raw = String(meta.capabilities ?? "").trim();
      if (!raw) {
        return true;
      }
      const caps = raw.split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      return caps.includes("update") || caps.includes("editing");
    },

    /**
     * Check if a field can be sent in applyEdits attribute updates.
     *
     * @param {object} f - Field from layer fields[]
     * @param {object} meta - Layer metadata (objectIdField, globalIdField, etc.)
     * @returns {boolean}
     */
    _fieldIsUpdatable(f, meta) {
      const name = f?.name;
      if (name == null || name === "") {
        return false;
      }
      const oid = meta?.objectIdField ?? "OBJECTID";
      const gid = meta?.globalIdField;
      const nLower = String(name).toLowerCase();
      if (nLower === String(oid).toLowerCase()) {
        return false;
      }
      if (gid != null && gid !== "" && nLower === String(gid).toLowerCase()) {
        return false;
      }
      const t = f.type || "";
      if (
        t === "esriFieldTypeOID"
        || t === "esriFieldTypeGlobalID"
        || t === "esriFieldTypeGeometry"
      ) {
        return false;
      }
      return f.editable !== false;
    },

    /**
     * Resolve a feature layer by numeric id or layer name (fallback).
     *
     * @param {object[]} layers - Array of layer entries from Feature Service root
     * @param {string|number} layerRef - Layer index as string or layer name
     * @returns {object|undefined}
     */
    _findLayerById(layers, layerRef) {
      if (layerRef == null || String(layerRef).trim() === "") {
        return undefined;
      }
      const ref = String(layerRef).trim();
      const byId = layers.find((l) => l.id != null && String(l.id) === ref);
      if (byId) {
        return byId;
      }
      return layers.find((l) => l.name?.toLowerCase() === ref.toLowerCase());
    },

    /**
     * Runtime guard: throw if layer metadata does not support updates.
     *
     * @param {object} meta - Layer metadata
     * @param {string} layerLabel - Display name for error messages
     */
    assertLayerSupportsUpdates(meta, layerLabel) {
      const label = layerLabel || "layer";
      if (!this._layerMetadataSupportsUpdates(meta)) {
        const caps = meta?.capabilities != null
          ? String(meta.capabilities)
          : "(none)";
        const se = meta?.supportsEditing;
        throw new Error(
          `Layer "${label}" does not support updates in service metadata `
          + `(supportsEditing: ${se}, capabilities: ${caps}). `
          + "Pick a different layer or connect an account with edit access.",
        );
      }
    },

    /**
     * Parse item.url into hosting origin and service path.
     *
     * @param {object} item - Portal item with url property
     * @param {string} refLabel - For error messages
     * @returns {{ baseUrl: string, servicePath: string }}
     */
    _serviceUrlFromItem(item, refLabel) {
      if (!item?.url) {
        throw new Error(`No service URL on item ${refLabel}`);
      }
      const match = item.url.match(/^(https?:\/\/[^/]+)(\/.*)$/);
      const baseUrl = match?.[1] || "";
      const servicePath = match?.[2] || "";
      if (!baseUrl || !servicePath) {
        throw new Error(
          `Could not parse feature service URL for ${refLabel}`,
        );
      }
      return {
        baseUrl,
        servicePath,
      };
    },

    /**
     * Resolve a Feature Service by portal item ID, full URL, or title.
     *
     * Accepts three input forms:
     * 1. Portal item ID (32-char hex) - resolved via /content/items/{id}
     * 2. Full FeatureServer URL - used directly
     * 3. Title string - org-scoped portal search with full pagination
     *
     * @param {object} opts
     * @param {object} opts.$ - Pipedream execution context
     * @param {string} opts.featureService - Item ID, URL, or title
     * @returns {Promise<{ baseUrl: string, servicePath: string }>}
     */
    async getFeatureServerPath({
      $, featureService,
    }) {
      const ref = String(featureService ?? "").trim();
      if (!ref) {
        throw new Error("featureService is required");
      }

      if (/^https?:\/\//i.test(ref) && /\/FeatureServer(\/|$)/i.test(ref)) {
        const fsMatch = ref.match(
          /^(https?:\/\/[^/]+)(\/.*\/FeatureServer)/i,
        );
        if (!fsMatch) {
          throw new Error(
            `Could not parse Feature Service URL: "${ref}"`,
          );
        }
        return {
          baseUrl: fsMatch[1],
          servicePath: fsMatch[2],
        };
      }

      if (PORTAL_ITEM_ID_RE.test(ref)) {
        const item = await this._request({
          $,
          baseUrl: PORTAL_REST,
          url: `/content/items/${ref}`,
          params: {
            f: "json",
          },
        });
        const url = item.url || "";
        if (!/\/FeatureServer(\/|$)/i.test(url)) {
          throw new Error(
            `Portal item ${ref} must point to a FeatureServer URL`,
          );
        }
        return this._serviceUrlFromItem(item, `id ${ref}`);
      }

      const user = await this._getCurrentUser({
        $,
      });
      const orgFilter = user.orgId
        ? ` AND orgid:${user.orgId}`
        : "";
      const refLower = ref.toLowerCase();
      const matches = [];
      let start = 1;
      let pagesFetched = 0;

      while (true) {
        const data = await this._request({
          $,
          baseUrl: PORTAL_REST,
          url: "/search",
          params: {
            q: `title:"${ref.replace(/"/g, "")}" AND type:"Feature Service"${orgFilter}`,
            num: PAGE_SIZE,
            start,
            f: "json",
          },
        });
        pagesFetched++;
        const results = data?.results ?? [];
        for (const r of results) {
          if (
            r?.title != null
            && String(r.title).toLowerCase() === refLower
            && /FeatureServer/i.test(r.url || "")
          ) {
            matches.push(r);
          }
        }
        if (matches.length >= 2) {
          break;
        }
        const nextStart = data?.nextStart;
        if (
          typeof nextStart !== "number"
          || nextStart <= start
          || nextStart === -1
          || pagesFetched >= MAX_TITLE_PAGES
        ) {
          break;
        }
        start = nextStart;
      }

      if (matches.length === 0) {
        throw new Error(`No Feature Service found with title: "${ref}"`);
      }
      if (matches.length > 1) {
        throw new Error(
          `Multiple portal items share the feature service title "${ref}". `
          + "Pass the portal item ID (32-character hex) or full FeatureServer URL instead.",
        );
      }
      return this._serviceUrlFromItem(matches[0], `title "${ref}"`);
    },

    /**
     * List layer entries from a Feature Service root.
     *
     * @param {object} opts
     * @param {object} opts.$ - Pipedream execution context
     * @param {string} opts.baseUrl
     * @param {string} opts.servicePath
     * @returns {Promise<object[]>}
     */
    async getLayers({
      $, baseUrl, servicePath,
    }) {
      const data = await this._request({
        $,
        baseUrl,
        url: servicePath,
        params: {
          f: "json",
        },
      });
      return data.layers ?? [];
    },

    /**
     * Portal search for Feature Services (org-scoped by default).
     *
     * @param {object} opts
     * @param {object} opts.$ - Pipedream execution context
     * @param {string} [opts.query] - User search text
     * @param {object} [opts.prevContext] - Pagination context
     * @param {number} [opts.prevContext.nextStart]
     * @param {boolean} [opts.includePublic=false] - Include public Feature Services beyond the org
     * @returns {Promise<{ options: object[], context: object }>}
     */
    async searchFeatureServices({
      $, query, prevContext, includePublic = false,
    }) {
      const start = prevContext?.nextStart ?? 1;
      const raw = String(query ?? "").trim()
        .replace(/"/g, "");

      let orgFilter = "";
      try {
        const user = await this._getCurrentUser({
          $,
        });
        if (user.orgId && !includePublic) {
          orgFilter = ` AND orgid:${user.orgId}`;
        }
      } catch (err) {
        const msg = err?.message ?? "";
        if (msg.includes("oauth_access_token") || /\[(401|403|498|499)\]/.test(msg)) {
          throw err;
        }
        console.warn("ArcGIS org lookup unavailable, falling back to unscoped search:", msg);
      }

      const params = {
        num: PAGE_SIZE,
        start,
        f: "json",
      };
      params.q = raw
        ? `${raw} AND type:"Feature Service"${orgFilter}`
        : `type:"Feature Service"${orgFilter}`;

      const data = await this._request({
        $,
        baseUrl: PORTAL_REST,
        url: "/search",
        params,
      });
      const results = data?.results ?? [];
      const seen = new Set();
      const options = [];
      for (const item of results) {
        const id = item.id;
        const title = item.title || "(no title)";
        if (id == null || id === "" || seen.has(id)) {
          continue;
        }
        seen.add(id);
        options.push({
          label: title,
          value: id,
        });
      }
      const nextStart = data?.nextStart;
      const hasMore = typeof nextStart === "number" && nextStart > start;
      return {
        options,
        context: hasMore
          ? {
            nextStart,
          }
          : {},
      };
    },

    /**
     * All Feature Services accessible to the user (paginated, for List action).
     *
     * @param {object} opts
     * @param {object} opts.$ - Pipedream execution context
     * @param {string} [opts.query] - Optional search text
     * @param {boolean} [opts.includePublic=false] - Include public Feature Services beyond the org
     * @param {number} [opts.maxRecords=500] - Safety limit on total results
     * @returns {Promise<{ items: object[], truncated: boolean }>}
     *   `items` — flat array of { itemId, title, url, owner, description };
     *   `truncated` — true when the result set was cut off at maxRecords
     */
    async listAllFeatureServices({
      $, query, includePublic = false, maxRecords = 500,
    }) {
      const raw = String(query ?? "").trim()
        .replace(/"/g, "");
      let orgFilter = "";
      try {
        const user = await this._getCurrentUser({
          $,
        });
        if (user.orgId && !includePublic) {
          orgFilter = ` AND orgid:${user.orgId}`;
        }
      } catch (err) {
        const msg = err?.message ?? "";
        if (msg.includes("oauth_access_token") || /\[(401|403|498|499)\]/.test(msg)) {
          throw err;
        }
        console.warn("ArcGIS org lookup unavailable, falling back to unscoped search:", msg);
      }

      const q = raw
        ? `${raw} AND type:"Feature Service"${orgFilter}`
        : `type:"Feature Service"${orgFilter}`;

      const all = [];
      let start = 1;
      let truncated = false;

      while (all.length < maxRecords) {
        const data = await this._request({
          $,
          baseUrl: PORTAL_REST,
          url: "/search",
          params: {
            q,
            num: PAGE_SIZE,
            start,
            f: "json",
          },
        });
        const results = data?.results ?? [];
        for (const item of results) {
          if (all.length >= maxRecords) {
            truncated = true;
            break;
          }
          all.push({
            itemId: item.id,
            title: item.title || "(no title)",
            url: item.url || "",
            owner: item.owner || "",
            description: item.snippet || item.description || "",
          });
        }
        const nextStart = data?.nextStart;
        const hasMorePages = typeof nextStart === "number"
          && nextStart > start
          && nextStart !== -1;
        if (!hasMorePages) {
          break;
        }
        if (all.length >= maxRecords) {
          truncated = true;
          break;
        }
        start = nextStart;
      }

      return {
        items: all,
        truncated,
      };
    },

    /**
     * Dropdown options for layers in a Feature Service.
     *
     * @param {object} opts
     * @param {object} opts.$ - Pipedream execution context
     * @param {string} opts.featureService - Item ID, URL, or title
     * @param {boolean} [opts.editableOnly=false] - Only layers with update capability
     * @returns {Promise<object[]>} Array of { label, value } for dropdown
     */
    async listLayerNameOptions({
      $, featureService, editableOnly = false,
    }) {
      const {
        baseUrl, servicePath,
      } = await this.getFeatureServerPath({
        $,
        featureService,
      });
      const layers = await this.getLayers({
        $,
        baseUrl,
        servicePath,
      });
      const named = layers.filter((l) => l.name && l.id != null);
      if (!editableOnly) {
        return named.map((l) => ({
          label: l.name,
          value: String(l.id),
        }));
      }
      const metas = await Promise.all(
        named.map((l) => this._request({
          $,
          baseUrl,
          url: `${servicePath}/${l.id}`,
          params: {
            f: "json",
          },
        })),
      );
      return named
        .filter((_, i) => this._layerMetadataSupportsUpdates(metas[i]))
        .map((l) => ({
          label: l.name,
          value: String(l.id),
        }));
    },

    /**
     * Dropdown options for field names on a layer.
     *
     * @param {object} opts
     * @param {object} opts.$ - Pipedream execution context
     * @param {string} opts.featureService - Item ID, URL, or title
     * @param {string} opts.layerId - Layer index or name
     * @param {boolean} [opts.editableOnly=false] - Only user-editable fields
     * @returns {Promise<object[]>} Array of { label, value } for dropdown
     */
    async listLayerFieldOptions({
      $, featureService, layerId, editableOnly = false,
    }) {
      const {
        baseUrl, servicePath,
      } = await this.getFeatureServerPath({
        $,
        featureService,
      });
      const layers = await this.getLayers({
        $,
        baseUrl,
        servicePath,
      });
      const layer = this._findLayerById(layers, layerId);
      if (layer?.id == null) {
        return [];
      }
      const meta = await this._request({
        $,
        baseUrl,
        url: `${servicePath}/${layer.id}`,
        params: {
          f: "json",
        },
      });
      let fields = meta.fields ?? [];
      if (editableOnly) {
        fields = fields.filter((f) => this._fieldIsUpdatable(f, meta));
      }
      return fields.map((f) => {
        const name = f.name;
        const alias = f.alias && f.alias !== name
          ? ` (${f.alias})`
          : "";
        return {
          label: `${name}${alias}`,
          value: name,
        };
      });
    },

    /**
     * Get field metadata for a layer (for the List Layer Fields action).
     *
     * @param {object} opts
     * @param {object} opts.$ - Pipedream execution context
     * @param {string} opts.featureService - Item ID, URL, or title
     * @param {string} opts.layerId - Layer index or name
     * @returns {Promise<object[]>} Flat array of { name, alias, type, editable, updatable }
     *   `editable` — raw server flag (f.editable); may be true for OID/GlobalID fields.
     *   `updatable` — derived flag; false for OID, GlobalID, and Geometry fields even
     *   when the server reports them as editable. Use this when deciding which fields
     *   to include in an applyEdits attribute update.
     */
    async getLayerFields({
      $, featureService, layerId,
    }) {
      const {
        baseUrl, servicePath,
      } = await this.getFeatureServerPath({
        $,
        featureService,
      });
      const layers = await this.getLayers({
        $,
        baseUrl,
        servicePath,
      });
      const layer = this._findLayerById(layers, layerId);
      if (layer?.id == null) {
        throw new Error(
          `Layer '${layerId}' not found in this feature service`,
        );
      }
      const meta = await this._request({
        $,
        baseUrl,
        url: `${servicePath}/${layer.id}`,
        params: {
          f: "json",
        },
      });
      return (meta.fields ?? []).map((f) => ({
        name: f.name,
        alias: f.alias || f.name,
        type: f.type,
        editable: f.editable !== false,
        updatable: this._fieldIsUpdatable(f, meta),
      }));
    },

    /**
     * Paginated OBJECTID dropdown options.
     *
     * @param {object} opts
     * @param {object} opts.$ - Pipedream execution context
     * @param {string} opts.featureService - Item ID, URL, or title
     * @param {string} opts.layerId - Layer index or name
     * @param {object} [opts.prevContext] - Pagination context
     * @param {boolean} [opts.editableOnly=false] - Skip if layer not editable
     * @returns {Promise<{ options: object[], context: object }>}
     */
    async listObjectIdOptions({
      $, featureService, layerId, prevContext, editableOnly = false,
    }) {
      const batch = 100;
      const offset = prevContext?.nextOffset ?? 0;
      const {
        baseUrl, servicePath,
      } = await this.getFeatureServerPath({
        $,
        featureService,
      });
      const layers = await this.getLayers({
        $,
        baseUrl,
        servicePath,
      });
      const layer = this._findLayerById(layers, layerId);
      if (layer?.id == null) {
        return {
          options: [],
          context: {},
        };
      }
      const meta = await this._request({
        $,
        baseUrl,
        url: `${servicePath}/${layer.id}`,
        params: {
          f: "json",
        },
      });
      if (editableOnly && !this._layerMetadataSupportsUpdates(meta)) {
        return {
          options: [],
          context: {},
        };
      }
      const oidField = meta.objectIdField || "OBJECTID";
      const data = await this._request({
        $,
        baseUrl,
        url: `${servicePath}/${layer.id}/query`,
        params: {
          where: "1=1",
          returnGeometry: "false",
          outFields: oidField,
          resultRecordCount: batch,
          resultOffset: offset,
          orderByFields: `${oidField} DESC`,
          f: "json",
        },
      });
      const feats = data.features ?? [];
      const ids = feats
        .map((f) => f.attributes?.[oidField])
        .filter((id) => id != null && id !== "");
      const options = ids.map((id) => ({
        label: `${oidField} ${id}`,
        value: String(id),
      }));
      const hasMore = data.exceededTransferLimit === true
        || (feats.length === batch && data.exceededTransferLimit !== false);
      return {
        options,
        context: hasMore
          ? {
            nextOffset: offset + feats.length,
          }
          : {},
      };
    },

    /**
     * Fetch the geometry of the first matching feature from a layer query.
     *
     * @param {object} opts
     * @param {object} opts.$ - Pipedream execution context
     * @param {string} opts.featureService - Item ID, URL, or title
     * @param {string} opts.layerId - Layer index or name
     * @param {object} opts.queryParams - e.g. { objectIds } or { where }
     * @returns {Promise<{ boundary: object|undefined, data: object }>}
     */
    async fetchFirstFeatureGeometry({
      $, featureService, layerId, queryParams,
    }) {
      const {
        baseUrl, servicePath,
      } = await this.getFeatureServerPath({
        $,
        featureService,
      });
      const layers = await this.getLayers({
        $,
        baseUrl,
        servicePath,
      });
      const layer = this._findLayerById(layers, layerId);
      if (layer?.id == null) {
        throw new Error(
          `Layer '${layerId}' not found in this feature service`,
        );
      }
      const data = await this._request({
        $,
        baseUrl,
        url: `${servicePath}/${layer.id}/query`,
        params: {
          resultRecordCount: 1,
          returnGeometry: "true",
          outFields: "*",
          f: "json",
          ...queryParams,
        },
      });
      const boundary = data.features?.[0]?.geometry;
      if (boundary && data.spatialReference) {
        boundary.spatialReference = data.spatialReference;
      }
      return {
        boundary,
        data,
      };
    },

    /**
     * Layer query with paging; returns merged features array.
     *
     * @param {object} opts
     * @param {object} opts.$ - Pipedream execution context
     * @param {string} opts.featureService - Item ID, URL, or title
     * @param {string} opts.layerId - Layer index or name
     * @param {string} opts.where - SQL WHERE clause
     * @param {string} [opts.returnGeometry="false"]
     * @returns {Promise<{ features: object[], count: number }>}
     */
    async queryLayerAttributesAllPages({
      $, featureService, layerId, where, returnGeometry = "false",
    }) {
      const {
        baseUrl, servicePath,
      } = await this.getFeatureServerPath({
        $,
        featureService,
      });
      const layers = await this.getLayers({
        $,
        baseUrl,
        servicePath,
      });
      const targetLayer = this._findLayerById(layers, layerId);
      if (targetLayer?.id == null) {
        throw new Error(
          `Layer '${layerId}' not found. Check service definition.`,
        );
      }
      const meta = await this._request({
        $,
        baseUrl,
        url: `${servicePath}/${targetLayer.id}`,
        params: {
          f: "json",
        },
      });
      const maxRc = meta.maxRecordCount;
      const pageSize = typeof maxRc === "number" && maxRc > 0
        ? Math.min(maxRc, 5000)
        : 1000;
      const all = [];
      let offset = 0;
      while (true) {
        const data = await this._request({
          $,
          baseUrl,
          url: `${servicePath}/${targetLayer.id}/query`,
          params: {
            where,
            outFields: "*",
            returnGeometry,
            f: "json",
            resultOffset: offset,
            resultRecordCount: pageSize,
          },
        });
        const batch = data.features ?? [];
        all.push(...batch);
        if (data.exceededTransferLimit !== true) {
          break;
        }
        offset += batch.length;
        if (batch.length === 0) {
          break;
        }
      }
      return {
        features: all,
        count: all.length,
      };
    },

    /**
     * Resolve layer id and metadata (objectIdField) for a given service + layer.
     *
     * @param {object} opts
     * @param {object} opts.$ - Pipedream execution context
     * @param {string} opts.featureService - Item ID, URL, or title
     * @param {string} opts.layerId - Layer index or name
     * @returns {Promise<{ baseUrl, servicePath, layerId, objectIdField, layerDisplayName, meta }>}
     */
    async resolveLayerContext({
      $, featureService, layerId,
    }) {
      const {
        baseUrl, servicePath,
      } = await this.getFeatureServerPath({
        $,
        featureService,
      });
      const layers = await this.getLayers({
        $,
        baseUrl,
        servicePath,
      });
      const layer = this._findLayerById(layers, layerId);
      if (layer?.id == null) {
        throw new Error(`Layer '${layerId}' not found`);
      }
      const meta = await this._request({
        $,
        baseUrl,
        url: `${servicePath}/${layer.id}`,
        params: {
          f: "json",
        },
      });
      const objectIdField = meta.objectIdField || "OBJECTID";
      const layerDisplayName = meta.name != null && meta.name !== ""
        ? meta.name
        : String(layer.id);
      return {
        baseUrl,
        servicePath,
        layerId: layer.id,
        objectIdField,
        layerDisplayName,
        meta,
      };
    },

    /**
     * POST applyEdits for a known layer id (form-encoded).
     *
     * @param {object} opts
     * @param {object} opts.$ - Pipedream execution context
     * @param {string} opts.baseUrl
     * @param {string} opts.servicePath
     * @param {number} opts.layerId
     * @param {object} opts.attributes - Field names including object id field
     * @returns {Promise<object>}
     */
    async postApplyEdits({
      $, baseUrl, servicePath, layerId, attributes,
    }) {
      const updates = JSON.stringify([
        {
          attributes,
        },
      ]);
      return this._request({
        $,
        baseUrl,
        url: `${servicePath}/${layerId}/applyEdits`,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: `f=json&updates=${encodeURIComponent(updates)}`,
      });
    },

    /**
     * Validate and normalize geometry for spatial intersect queries.
     *
     * @param {object|string} boundary
     * @returns {{
     *   ok: boolean,
     *   boundary?: object,
     *   inSR?: string,
     *   geometryType?: string,
     *   error?: string
     * }}
     */

    _normalizeBoundaryForQuery(boundary) {
      let g = boundary;
      if (g == null || (typeof g === "string" && !String(g).trim())) {
        return {
          ok: false,
          error: "No geometry available",
        };
      }
      if (typeof g === "string") {
        try {
          g = JSON.parse(g.trim());
        } catch {
          return {
            ok: false,
            error: "Geometry must be a JSON object or a JSON string",
          };
        }
      }
      if (typeof g !== "object" || g === null || Array.isArray(g)) {
        return {
          ok: false,
          error: "Geometry must be a JSON object",
        };
      }

      if (
        g.geometry != null
        && typeof g.geometry === "object"
        && !Array.isArray(g.geometry)
      ) {
        const inner = g.geometry;
        const innerHasShape =
          (Array.isArray(inner.rings) && inner.rings.length > 0)
          || (Array.isArray(inner.paths) && inner.paths.length > 0)
          || (inner.x !== undefined && inner.y !== undefined);
        if (innerHasShape) {
          const innerSr = inner.spatialReference;
          const innerWkid = innerSr?.wkid ?? innerSr?.latestWkid;
          if (innerWkid == null || innerWkid === "") {
            const inSR = g.inSR ?? g.inSr;
            if (inSR != null && String(inSR).trim() !== "") {
              const n = Number(String(inSR).trim());
              if (!Number.isFinite(n)) {
                return {
                  ok: false,
                  error:
                    "Query-style geometry: `inSR` must be a numeric WKID when the nested geometry omits spatialReference",
                };
              }
              g = {
                ...inner,
                spatialReference: {
                  wkid: n,
                },
              };
            } else if (g.spatialReference) {
              g = {
                ...inner,
                spatialReference: g.spatialReference,
              };
            } else {
              g = inner;
            }
          } else {
            g = inner;
          }
        }
      }
      const sr = g.spatialReference;
      const wkid = sr?.wkid ?? sr?.latestWkid;
      if (wkid == null || wkid === "") {
        return {
          ok: false,
          error:
            "Geometry missing spatial reference: include spatialReference with wkid or latestWkid",
        };
      }
      const hasRings = Array.isArray(g.rings) && g.rings.length > 0;
      const hasPaths = Array.isArray(g.paths) && g.paths.length > 0;
      const hasPoint = g.x !== undefined && g.x !== null
        && g.y !== undefined && g.y !== null;
      if (!hasRings && !hasPaths && !hasPoint) {
        return {
          ok: false,
          error:
            "Geometry must be a polygon (`rings`), polyline (`paths`), or point (`x`/`y`)",
        };
      }
      let geometryType;
      if (hasRings) {
        geometryType = "esriGeometryPolygon";
      } else if (hasPaths) {
        geometryType = "esriGeometryPolyline";
      } else {
        geometryType = "esriGeometryPoint";
      }
      return {
        ok: true,
        boundary: g,
        inSR: String(wkid),
        geometryType,
      };
    },

    /**
     * Query multiple layers for features intersecting a geometry.
     *
     * @param {object} opts
     * @param {object} opts.$ - Pipedream execution context
     * @param {string} opts.featureService - Item ID, URL, or title
     * @param {object|string} opts.boundary - Esri geometry with spatialReference
     * @param {string[]} opts.targetLayerIds - Layer indices or names to query
     * @returns {Promise<{
     *   geometryType: string,
     *   layers: Record<string, {
     *     id: number,
     *     name: string,
     *     count: number,
     *     features: object[]
     *   }>
     * }>}

     */
    async queryIntersectingFeaturesByGeometry({
      $, featureService, boundary, targetLayerIds,
    }) {
      const normalized = this._normalizeBoundaryForQuery(boundary);
      if (!normalized.ok) {
        throw new Error(normalized.error);
      }
      const {
        boundary: geom, inSR, geometryType,
      } = normalized;

      const {
        baseUrl, servicePath,
      } = await this.getFeatureServerPath({
        $,
        featureService,
      });
      const layers = await this.getLayers({
        $,
        baseUrl,
        servicePath,
      });

      const rawResolvedLayers = targetLayerIds.map((ref) => {
        const layer = this._findLayerById(layers, ref);
        if (layer?.id == null) {
          throw new Error(
            `Layer '${ref}' not found in this feature service`,
          );
        }
        return {
          name: layer.name || String(layer.id),
          id: layer.id,
        };
      });

      // Handles edge case where duplicate Ids or both id an name are provided for a layer
      const seenIds = new Set();
      const resolvedLayers = rawResolvedLayers.filter(({ id }) => {
        if (seenIds.has(id)) {
          return false;
        }
        seenIds.add(id);
        return true;
      });

      const pageSizeById = new Map();
      await Promise.all(resolvedLayers.map(async ({ id }) => {
        const meta = await this._request({
          $,
          baseUrl,
          url: `${servicePath}/${id}`,
          params: {
            f: "json",
          },
        });
        const maxRc = meta.maxRecordCount;
        const pageSize = typeof maxRc === "number" && maxRc > 0
          ? Math.min(maxRc, 5000)
          : 1000;
        pageSizeById.set(id, pageSize);
      }));

      const queryOneLayer = async ({
        name, id,
      }) => {
        const pageSize = pageSizeById.get(id) ?? 1000;
        const collected = [];
        let offset = 0;
        while (true) {
          const body = new URLSearchParams({
            f: "json",
            geometry: JSON.stringify(geom),
            geometryType,
            inSR,
            spatialRel: "esriSpatialRelIntersects",
            outFields: "*",
            returnGeometry: "false",
            resultOffset: String(offset),
            resultRecordCount: String(pageSize),
          }).toString();
          const data = await this._request({
            $,
            baseUrl,
            url: `${servicePath}/${id}/query`,
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            data: body,
          });
          const batch = data.features ?? [];
          collected.push(...batch.map((f) => f.attributes));
          if (data.exceededTransferLimit !== true) {
            break;
          }
          offset += batch.length;
          if (batch.length === 0) {
            break;
          }
        }
        return {
          id,
          name,
          count: collected.length,
          features: collected,
        };
      };

      const perLayer = await Promise.all(
        resolvedLayers.map((entry) => queryOneLayer(entry)),
      );

      const result = {
        geometryType,
        layers: {},
      };
      for (const {
        id, name, count, features,
      } of perLayer) {
        const key = String(id);
        result.layers[key] = {
          id,
          name,
          count,
          features,
        };
      }
      return result;
    },
  },
};
