import arcgisOnline from "../../arcgis_online.app.mjs";

export default {
  key: "arcgis_online-query-intersecting-features-by-search-query",
  name: "Query Intersecting Features by Search Query",
  description:
    "Find features that intersect with the geometry of a feature matched by a WHERE clause on a layer, then query target layers. [See the documentation](https://developers.arcgis.com/rest/)",
  version: "0.0.7",
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
    },
    layerName: {
      propDefinition: [
        arcgisOnline,
        "layerName",
        (c) => ({
          mapTitle: c.mapTitle,
        }),
      ],
    },
    whereClause: {
      type: "string",
      label: "WHERE Clause",
      description:
        "WHERE clause to find the boundary feature (e.g. `SLJONumber = '12345'` or `Name = 'Test Feature'`)",
    },
    targetLayerNames: {
      propDefinition: [
        arcgisOnline,
        "targetLayerNames",
        (c) => ({
          mapTitle: c.mapTitle,
        }),
      ],
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
      throw new Error(`No feature found in layer '${layerName}' with WHERE ${whereClause}`);
    }

    const result = await app.queryIntersectingFeaturesByGeometry({
      $,
      mapTitle,
      boundary,
      targetLayerNames,
    });

    if (result.error) {
      throw new Error(result.error);
    }

    const total = Object.values(result.layers || {})
      .reduce((n, l) => n + (l.count || 0), 0);
    $.export("$summary", `Found ${total} intersecting feature(s) across ${Object.keys(result.layers || {}).length} layer(s)`);

    return result;
  },
};
