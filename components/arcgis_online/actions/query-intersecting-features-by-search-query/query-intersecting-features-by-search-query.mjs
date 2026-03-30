import arcgisOnline from "../../arcgis_online.app.mjs";

export default {
  key: "arcgis_online-query-intersecting-features-by-search-query",
  name: "Query Intersecting Features by Search Query",
  description:
    "On the source layer, run a SQL `WHERE` clause to load one boundary feature (first match only, `resultRecordCount` 1). Use that feature's geometry to intersect-query the target layers in the same hosted feature service. Returns per-layer attribute lists only, same structure as Query Intersecting Features by Geometry. See [Feature Layer query](https://developers.arcgis.com/rest/services-reference/enterprise/query-feature-service-layer-.htm) (`where` parameter)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    arcgisOnline,
    mapTitle: {
      propDefinition: [
        arcgisOnline,
        "mapTitle",
      ],
      description:
        "Portal item ID from search, or feature service title for lookup",
    },
    layerName: {
      propDefinition: [
        arcgisOnline,
        "layerName",
        (c) => ({
          mapTitle: c.mapTitle,
        }),
      ],
      description:
        "Layer id whose `query` `where` clause selects the single boundary feature",
    },
    whereClause: {
      type: "string",
      label: "WHERE Clause",
      description:
        "SQL `WHERE` fragment passed to the layer `query` API (e.g. `OBJECTID = 1` or `APN = '123-456'`). Only the **first** returned feature is used",
    },
    targetLayerNames: {
      propDefinition: [
        arcgisOnline,
        "targetLayerNames",
        (c) => ({
          mapTitle: c.mapTitle,
        }),
      ],
      description:
        "Target layer ids in the same service to intersect-query against the boundary",
    },
  },
  async run({ $ }) {
    const {
      arcgisOnline: app,
      mapTitle,
      layerName,
      whereClause,
      targetLayerNames,
    } = this;

    if (!mapTitle) {
      throw new Error("mapTitle is required");
    }
    if (!targetLayerNames?.length) {
      throw new Error("targetLayerNames is required");
    }
    if (!layerName) {
      throw new Error("layerName is required");
    }
    if (!whereClause) {
      throw new Error("whereClause is required");
    }

    const { boundary } = await app.fetchFirstFeatureGeometry({
      $,
      mapTitle,
      layerName,
      queryParams: {
        where: whereClause,
      },
    });

    if (!boundary) {
      throw new Error(
        `No feature found in layer id '${layerName}' with WHERE ${whereClause}`,
      );
    }

    const result = await app.queryIntersectingFeaturesByGeometry({
      $,
      mapTitle,
      boundary,
      targetLayerNames,
    });

    const total = Object.values(result.layers || {})
      .reduce((n, l) => n + (l.count || 0), 0);
    $.export("$summary", `Found ${total} intersecting feature(s) across ${Object.keys(result.layers || {}).length} layer(s)`);

    return result;
  },
};
