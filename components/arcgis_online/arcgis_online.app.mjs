import { axios } from "@pipedream/platform";

const PORTAL_REST = "https://www.arcgis.com/sharing/rest";
// Portal /search allows up to 100 results per request
const PAGE_SIZE = 100;

export default {
  type: "app",
  app: "arcgis_online",
  propDefinitions: {
    mapTitle: {
      type: "string",
      label: "Map / Feature Service Title",
      description:
        "Hosted feature service title. Search matches title, tags, snippet, and description (not only title)",
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
      return body;
    },

    /**
     * Resolve feature service URL from an exact title match (Prismatic get_map_url).
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.mapTitle
     * @returns {Promise<{ baseUrl: string, servicePath: string }>}
     */
    async getFeatureServerPath({
      $, mapTitle,
    }) {
      const data = await this._request({
        $,
        baseUrl: PORTAL_REST,
        url: "/search",
        params: {
          q: `title:"${mapTitle}" AND type:"Feature Service"`,
          num: 1,
          f: "json",
        },
      });
      if (data?.error) {
        const msg = data.error.message || JSON.stringify(data.error);
        throw new Error(`ArcGIS portal search failed: ${msg}`);
      }
      const item = data?.results?.[0];
      if (!item?.url) {
        throw new Error(`No Feature Service found with title: "${mapTitle}"`);
      }
      const match = item.url.match(/^(https?:\/\/[^/]+)(\/.*)$/);
      const baseUrl = match?.[1] || "";
      const servicePath = match?.[2] || "";
      if (!baseUrl || !servicePath) {
        throw new Error(`Could not parse feature service URL for "${mapTitle}"`);
      }
      return {
        baseUrl,
        servicePath,
      };
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
      // ArcGIS only allows * wildcards at the END of a field term (not title:*foo*).
      // Use full-text `q` + exact `filter` on type so matches can hit title, tags, snippet, etc.
      // See https://developers.arcgis.com/rest/users-groups-and-items/search-reference/
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
      if (data?.error) {
        const msg = data.error.message || JSON.stringify(data.error);
        throw new Error(`ArcGIS portal search failed: ${msg}`);
      }
      const results = data?.results ?? [];
      const seen = new Set();
      const options = [];
      for (const item of results) {
        const title = item.title;
        if (!title || seen.has(title)) {
          continue;
        }
        seen.add(title);
        options.push({
          label: title,
          value: title,
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
     */
    async listLayerNameOptions({
      $, mapTitle,
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
      return layers
        .filter((l) => l.name)
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
     */
    async listLayerFieldOptions({
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
      if (!layer?.id) {
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
      const fields = meta.fields ?? [];
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
     * Paginated OBJECTID values for async options (layer query with returnIdsOnly).
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.mapTitle
     * @param {string} opts.layerName
     * @param {object} [opts.prevContext]
     * @param {number} [opts.prevContext.nextOffset]
     */
    async listObjectIdOptions({
      $, mapTitle, layerName, prevContext,
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
      if (!layer?.id) {
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
      const oidField = meta.objectIdField || "OBJECTID";
      const data = await this._request({
        $,
        baseUrl,
        url: `${servicePath}/${layer.id}/query`,
        params: {
          where: "1=1",
          returnIdsOnly: "true",
          resultRecordCount: batch,
          resultOffset: offset,
          // Match ArcGIS Online item tables (newest / highest OIDs first)
          orderByFields: `${oidField} DESC`,
          f: "json",
        },
      });
      if (data?.error) {
        const msg = data.error.message || JSON.stringify(data.error);
        throw new Error(`ArcGIS query failed: ${msg}`);
      }
      const ids = data.objectIds ?? [];
      const options = ids.map((id) => ({
        label: `${oidField} ${id}`,
        value: String(id),
      }));
      const hasMore = data.exceededTransferLimit === true
        || (ids.length === batch && data.exceededTransferLimit !== false);
      return {
        options,
        context: hasMore
          ? {
            nextOffset: offset + ids.length,
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
      if (!layer?.id) {
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
      if (!targetLayer?.id) {
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
     * POST applyEdits with a single update payload (form-encoded).
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.mapTitle
     * @param {string} opts.layerName
     * @param {Record<string, unknown>} opts.attributes - OBJECTID and fields to update
     */
    async applyFeatureUpdates({
      $, mapTitle, layerName, attributes,
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
      if (!layer?.id) {
        throw new Error(`Layer '${layerName}' not found`);
      }
      const updates = JSON.stringify([
        {
          attributes,
        },
      ]);
      return this._request({
        $,
        baseUrl,
        url: `${servicePath}/${layer.id}/applyEdits`,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: `f=json&updates=${encodeURIComponent(updates)}`,
      });
    },

    /**
     * Query multiple layers for features intersecting a geometry (attributes only).
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.mapTitle
     * @param {object} opts.boundary - Esri geometry with spatialReference.wkid
     * @param {string[]} opts.targetLayerNames
     */
    async queryIntersectingFeaturesByGeometry({
      $, mapTitle, boundary, targetLayerNames,
    }) {
      if (!boundary) {
        return {
          error: "No geometry available",
        };
      }
      const spatialReference = boundary.spatialReference?.wkid;
      if (!spatialReference) {
        return {
          error: "Geometry missing spatial reference",
        };
      }

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
      if (boundary.rings) {
        geometryType = "esriGeometryPolygon";
      } else if (boundary.paths) {
        geometryType = "esriGeometryPolyline";
      } else if (boundary.x !== undefined && boundary.y !== undefined) {
        geometryType = "esriGeometryPoint";
      }

      const params = {
        geometry: JSON.stringify(boundary),
        geometryType,
        inSR: String(spatialReference),
        spatialRel: "esriSpatialRelIntersects",
        outFields: "*",
        returnGeometry: "false",
        f: "json",
      };

      const layerIds = targetLayerNames.map((name) => {
        const id = findId(name);
        if (!id) {
          throw new Error(`Layer '${name}' not found`);
        }
        return {
          name,
          id,
        };
      });

      const queryResults = await Promise.all(layerIds.map(({ id }) => this._request({
        $,
        baseUrl,
        url: `${servicePath}/${id}/query`,
        method: "GET",
        params,
      })));

      const result = {
        geometryType,
        layers: {},
      };
      layerIds.forEach(({ name }, index) => {
        const features = queryResults[index].features ?? [];
        result.layers[name] = {
          count: features.length,
          features: features.map((f) => f.attributes),
        };
      });
      return result;
    },
  },
};
