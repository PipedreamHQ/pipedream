import { axios } from "@pipedream/platform";

const PORTAL_REST = "https://www.arcgis.com/sharing/rest";
// Portal /search allows up to 100 results per request
const PAGE_SIZE = 100;
// ArcGIS Online hosted item ids are 32 hex characters
const PORTAL_ITEM_ID_RE = /^[a-f0-9]{32}$/i;

export default {
  type: "app",
  app: "arcgis_online",
  propDefinitions: {
    mapTitle: {
      type: "string",
      label: "Map / Feature Service Title",
      description:
        "Hosted Feature Service: dropdown values are portal item IDs (stable). You can also enter a service title for lookup (ambiguous if titles collide)",
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
    layerName: {
      type: "string",
      label: "Layer Name",
      description: "Name of the layer in the feature service",
      async options({ mapTitle }) {
        if (!mapTitle) {
          return [];
        }
        return this.listLayerNameOptions({
          $: this,
          mapTitle,
        });
      },
    },
    targetLayerNames: {
      type: "string[]",
      label: "Target Layer Names",
      description: "One or more layers to query for intersecting features",
      async options({ mapTitle }) {
        if (!mapTitle) {
          return [];
        }
        return this.listLayerNameOptions({
          $: this,
          mapTitle,
        });
      },
    },
    columnName: {
      type: "string",
      label: "Column / Field Name",
      description: "Attribute field name on the layer",
      async options({
        mapTitle,
        layerName,
      }) {
        if (!mapTitle || !layerName) {
          return [];
        }
        return this.listLayerFieldOptions({
          $: this,
          mapTitle,
          layerName,
        });
      },
    },
    objectId: {
      type: "string",
      label: "Object ID",
      description:
        "Feature OBJECTID from the selected layer (paginated). You can still type an ID manually",
      async options({
        mapTitle,
        layerName,
        prevContext,
      }) {
        if (!mapTitle || !layerName) {
          return [];
        }
        return this.listObjectIdOptions({
          $: this,
          mapTitle,
          layerName,
          prevContext,
        });
      },
    },
    /** Same as layerName but only layers whose metadata allows Edit/Update */
    layerNameEditable: {
      type: "string",
      label: "Layer Name",
      description:
        "Layers that support editing in service metadata (query-only views excluded)",
      async options({ mapTitle }) {
        if (!mapTitle) {
          return [];
        }
        return this.listLayerNameOptions({
          $: this,
          mapTitle,
          editableOnly: true,
        });
      },
    },
    /** Same as columnName but only user-editable attribute fields */
    columnNameEditable: {
      type: "string",
      label: "Column / Field Name",
      description:
        "Editable attribute fields only (object id, global id, geometry, read-only excluded)",
      async options({
        mapTitle,
        layerName,
      }) {
        if (!mapTitle || !layerName) {
          return [];
        }
        return this.listLayerFieldOptions({
          $: this,
          mapTitle,
          layerName,
          editableOnly: true,
        });
      },
    },
    /** Object id options for a layer chosen from layerNameEditable */
    objectIdEditable: {
      type: "string",
      label: "Object ID",
      description:
        "Feature object id (paginated). Layer must support editing; you may type an id manually",
      async options({
        mapTitle,
        layerName,
        prevContext,
      }) {
        if (!mapTitle || !layerName) {
          return [];
        }
        return this.listObjectIdOptions({
          $: this,
          mapTitle,
          layerName,
          prevContext,
          editableOnly: true,
        });
      },
    },
  },
  methods: {
    /**
     * @param {object} opts
     * @param {object} opts.$ - Pipedream execution context (passed to axios)
     * @param {string} opts.baseUrl - Host origin for the request (e.g. https://services.arcgis.com/...)
     * @param {string} opts.url - Path beginning with `/` or relative to baseUrl
     * @param {string} [opts.method]
     * @param {object} [opts.params] - URL query parameters
     * @param {string|object} [opts.data] - Request body
     * @param {object} [opts.headers]
     * @returns {Promise<any>} Parsed JSON response body
     */
    async _request({
      $ = this, baseUrl, url, method = "GET", params, data, headers = {},
    }) {
      const token = this.$auth?.oauth_access_token;
      if (!token) {
        throw new Error("ArcGIS Online OAuth access token is missing. Connect an account.");
      }
      const origin = String(baseUrl).replace(/\/+$/, "");
      const path = url.startsWith("/")
        ? url
        : `/${url}`;
      // Platform axios returns response.data (not the full Axios response object).
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
     * True if layer JSON says attributes can be updated (Editing/Update capability).
     * @param {object} meta
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
     * True if a field can be sent in applyEdits attribute updates.
     * @param {object} f - Field from layer fields[]
     * @param {object} meta - Layer metadata (objectIdField, globalIdField, etc.)
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
      if (f.editable === false) {
        return false;
      }
      return true;
    },

    /**
     * Runtime guard before applyEdits (metadata may still allow Update while the user cannot edit).
     * @param {object} meta
     * @param {string} layerName
     */
    assertLayerSupportsUpdates(meta, layerName) {
      const label = layerName || "layer";
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
     * @param {object} item - Portal item with url
     * @param {string} refLabel - For error messages
     */
    _serviceUrlFromItem(item, refLabel) {
      if (!item?.url) {
        throw new Error(`No service URL on item ${refLabel}`);
      }
      const match = item.url.match(/^(https?:\/\/[^/]+)(\/.*)$/);
      const baseUrl = match?.[1] || "";
      const servicePath = match?.[2] || "";
      if (!baseUrl || !servicePath) {
        throw new Error(`Could not parse feature service URL for ${refLabel}`);
      }
      return {
        baseUrl,
        servicePath,
      };
    },

    /**
     * Resolve hosted feature service URL from portal item id or exact title.
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.mapTitle - Portal item id (32 hex) or feature service title
     * @returns {Promise<{ baseUrl: string, servicePath: string }>}
     */
    async getFeatureServerPath({
      $, mapTitle,
    }) {
      const ref = String(mapTitle ?? "").trim();
      if (!ref) {
        throw new Error("mapTitle is required");
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
      const data = await this._request({
        $,
        baseUrl: PORTAL_REST,
        url: "/search",
        params: {
          q: `title:"${ref.replace(/"/g, "")}" AND type:"Feature Service"`,
          num: PAGE_SIZE,
          f: "json",
        },
      });
      const results = data?.results ?? [];
      const refLower = ref.toLowerCase();
      const matches = results.filter((r) => {
        const title = r?.title;
        if (title == null) {
          return false;
        }
        if (String(title).toLowerCase() !== refLower) {
          return false;
        }
        return /FeatureServer/i.test(r.url || "");
      });
      if (matches.length === 0) {
        throw new Error(`No Feature Service found with title: "${ref}"`);
      }
      if (matches.length > 1) {
        throw new Error(
          `getFeatureServerPath: Multiple portal items share the feature service title "${ref}". `
          + "Pass the portal item ID (32-character hex from the item details page) as mapTitle instead of the title.",
        );
      }
      return this._serviceUrlFromItem(matches[0], `title "${ref}"`);
    },

    /**
     * List layer entries from a feature service root.
     * @param {object} opts
     * @param {object} opts.$
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
     * Portal search for feature services (async options for map title).
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} [opts.query] - User filter text
     * @param {object} [opts.prevContext]
     * @param {number} [opts.prevContext.nextStart]
     */
    async searchFeatureServices({
      $, query, prevContext,
    }) {
      const start = prevContext?.nextStart ?? 1;
      const raw = String(query ?? "").trim()
        .replace(/"/g, "");
      const params = {
        num: PAGE_SIZE,
        start,
        f: "json",
      };
      if (raw) {
        params.q = raw;
        params.filter = "type:\"Feature Service\"";
      } else {
        params.q = "type:\"Feature Service\"";
      }
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
     * Dropdown options for layer names.
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.mapTitle
     * @param {boolean} [opts.editableOnly] - Fetch metadata and keep layers with Update/Editing
     */
    async listLayerNameOptions({
      $, mapTitle, editableOnly = false,
    }) {
      const {
        baseUrl, servicePath,
      } = await this.getFeatureServerPath({
        $,
        mapTitle,
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
          value: l.name,
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
          value: l.name,
        }));
    },

    /**
     * Field names for a layer (async options for column).
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.mapTitle
     * @param {string} opts.layerName
     * @param {boolean} [opts.editableOnly] - User-editable fields only (not OID/global/geometry)
     */
    async listLayerFieldOptions({
      $, mapTitle, layerName, editableOnly = false,
    }) {
      const {
        baseUrl, servicePath,
      } = await this.getFeatureServerPath({
        $,
        mapTitle,
      });
      const layers = await this.getLayers({
        $,
        baseUrl,
        servicePath,
      });
      const layer = layers.find((l) => l.name?.toLowerCase() === layerName.toLowerCase());
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
     * Paginated OBJECTID async options (attribute query only; honors resultOffset).
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.mapTitle
     * @param {string} opts.layerName
     * @param {object} [opts.prevContext]
     * @param {number} [opts.prevContext.nextOffset]
     * @param {boolean} [opts.editableOnly] - No options if layer metadata does not support updates
     */
    async listObjectIdOptions({
      $, mapTitle, layerName, prevContext, editableOnly = false,
    }) {
      const batch = 100;
      const offset = prevContext?.nextOffset ?? 0;
      const {
        baseUrl, servicePath,
      } = await this.getFeatureServerPath({
        $,
        mapTitle,
      });
      const layers = await this.getLayers({
        $,
        baseUrl,
        servicePath,
      });
      const layer = layers.find((l) => l.name?.toLowerCase() === layerName.toLowerCase());
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
          // Match ArcGIS Online item tables (newest / highest OIDs first)
          orderByFields: `${oidField} DESC`,
          f: "json",
        },
      });
      const feats = data.features ?? [];
      const ids = feats.map((f) => f.attributes?.[oidField]).filter((id) => id != null && id !== "");
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
     * Run a layer query that returns at most one feature and merge spatialReference into geometry.
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.mapTitle
     * @param {string} opts.layerName
     * @param {Record<string, string>} opts.queryParams - e.g. objectIds or where
     */
    async fetchFirstFeatureGeometry({
      $, mapTitle, layerName, queryParams,
    }) {
      const {
        baseUrl, servicePath,
      } = await this.getFeatureServerPath({
        $,
        mapTitle,
      });
      const layers = await this.getLayers({
        $,
        baseUrl,
        servicePath,
      });
      const layer = layers.find((l) => l.name?.toLowerCase() === layerName.toLowerCase());
      if (layer?.id == null) {
        throw new Error(`Layer '${layerName}' not found`);
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
     * Query a layer by WHERE clause; returns raw query JSON.
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.mapTitle
     * @param {string} opts.layerName
     * @param {string} opts.where
     * @param {string} [opts.returnGeometry]
     */
    async queryLayerAttributes({
      $, mapTitle, layerName, where, returnGeometry = "false",
    }) {
      const {
        baseUrl, servicePath,
      } = await this.getFeatureServerPath({
        $,
        mapTitle,
      });
      const layers = await this.getLayers({
        $,
        baseUrl,
        servicePath,
      });
      const targetLayer = layers.find((l) => l.name?.toLowerCase() === layerName.toLowerCase());
      if (targetLayer?.id == null) {
        throw new Error(`Layer '${layerName}' not found. Check service definition.`);
      }
      return this._request({
        $,
        baseUrl,
        url: `${servicePath}/${targetLayer.id}/query`,
        params: {
          where,
          outFields: "*",
          returnGeometry,
          f: "json",
        },
      });
    },

    /**
     * Layer query by WHERE with paging until transfer limit clears; merged features.
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.mapTitle
     * @param {string} opts.layerName
     * @param {string} opts.where
     * @param {string} [opts.returnGeometry]
     */
    async queryLayerAttributesAllPages({
      $, mapTitle, layerName, where, returnGeometry = "false",
    }) {
      const {
        baseUrl, servicePath,
      } = await this.getFeatureServerPath({
        $,
        mapTitle,
      });
      const layers = await this.getLayers({
        $,
        baseUrl,
        servicePath,
      });
      const targetLayer = layers.find((l) => l.name?.toLowerCase() === layerName.toLowerCase());
      if (targetLayer?.id == null) {
        throw new Error(`Layer '${layerName}' not found. Check service definition.`);
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
     * Resolve layer id and metadata (objectIdField) by map reference and layer name.
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.mapTitle
     * @param {string} opts.layerName
     */
    async resolveLayerContext({
      $, mapTitle, layerName,
    }) {
      const {
        baseUrl, servicePath,
      } = await this.getFeatureServerPath({
        $,
        mapTitle,
      });
      const layers = await this.getLayers({
        $,
        baseUrl,
        servicePath,
      });
      const layer = layers.find((l) => l.name?.toLowerCase() === layerName.toLowerCase());
      if (layer?.id == null) {
        throw new Error(`Layer '${layerName}' not found`);
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
      return {
        baseUrl,
        servicePath,
        layerId: layer.id,
        objectIdField,
        meta,
      };
    },

    /**
     * POST applyEdits for a known layer id (form-encoded).
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.baseUrl
     * @param {string} opts.servicePath
     * @param {number} opts.layerId
     * @param {Record<string, unknown>} opts.attributes
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
     * POST applyEdits with a single update payload (form-encoded).
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.mapTitle
     * @param {string} opts.layerName
     * @param {Record<string, unknown>} opts.attributes - Field names incl. object id field
     */
    async applyFeatureUpdates({
      $, mapTitle, layerName, attributes,
    }) {
      const ctx = await this.resolveLayerContext({
        $,
        mapTitle,
        layerName,
      });
      return this.postApplyEdits({
        $,
        baseUrl: ctx.baseUrl,
        servicePath: ctx.servicePath,
        layerId: ctx.layerId,
        attributes,
      });
    },

    /**
     * Parse and validate geometry for intersect query (object or JSON string; wkid or latestWkid).
     * @param {unknown} boundary
     * @returns {{ ok: true, boundary: object, inSR: string } | { ok: false, error: string }}
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
      const sr = g.spatialReference;
      const wkid = sr?.wkid ?? sr?.latestWkid;
      if (wkid == null || wkid === "") {
        return {
          ok: false,
          error:
            "Geometry missing spatial reference: include spatialReference with wkid or latestWkid (e.g. 4326 for WGS 84)",
        };
      }
      return {
        ok: true,
        boundary: g,
        inSR: String(wkid),
      };
    },

    /**
     * Query multiple layers for features intersecting a geometry (attributes only).
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.mapTitle
     * @param {object|string} opts.boundary - Esri geometry; spatialReference.wkid or latestWkid
     * @param {string[]} opts.targetLayerNames
     */
    async queryIntersectingFeaturesByGeometry({
      $, mapTitle, boundary, targetLayerNames,
    }) {
      const normalized = this._normalizeBoundaryForQuery(boundary);
      if (!normalized.ok) {
        return {
          error: normalized.error,
        };
      }
      const {
        boundary: geom, inSR,
      } = normalized;

      const {
        baseUrl, servicePath,
      } = await this.getFeatureServerPath({
        $,
        mapTitle,
      });
      const layers = await this.getLayers({
        $,
        baseUrl,
        servicePath,
      });
      const findId = (name) => layers.find((l) => l.name?.toLowerCase() === name.toLowerCase())?.id;

      let geometryType = "esriGeometryPolygon";
      if (geom.rings) {
        geometryType = "esriGeometryPolygon";
      } else if (geom.paths) {
        geometryType = "esriGeometryPolyline";
      } else if (geom.x !== undefined && geom.y !== undefined) {
        geometryType = "esriGeometryPoint";
      }

      const layerIds = targetLayerNames.map((name) => {
        const id = findId(name);
        if (id == null) {
          throw new Error(`Layer '${name}' not found`);
        }
        return {
          name,
          id,
        };
      });

      const pageSizeById = new Map();
      await Promise.all(layerIds.map(async ({ id }) => {
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
          name,
          count: collected.length,
          features: collected,
        };
      };

      const perLayer = await Promise.all(layerIds.map((entry) => queryOneLayer(entry)));

      const result = {
        geometryType,
        layers: {},
      };
      for (const {
        name, count, features,
      } of perLayer) {
        result.layers[name] = {
          count,
          features,
        };
      }
      return result;
    },
  },
};
