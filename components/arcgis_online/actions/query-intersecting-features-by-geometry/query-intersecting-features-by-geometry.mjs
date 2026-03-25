import arcgisOnline from "../../arcgis_online.app.mjs";

export default {
  key: "arcgis_online-query-intersecting-features-by-geometry",
  name: "Query Intersecting Features by Geometry",
  description:
    "Find features that intersect with a provided geometry boundary. Use when you already have the geometry (polygon, polyline, or point) with spatial reference. [See the documentation](https://developers.arcgis.com/rest/)",
  version: "0.0.3",
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
    targetLayerNames: {
      propDefinition: [
        arcgisOnline,
        "targetLayerNames",
        (c) => ({
          mapTitle: c.mapTitle,
        }),
      ],
    },
    geometry: {
      type: "object",
      label: "Geometry",
      description:
        "ArcGIS geometry object with spatialReference (e.g. polygon with `rings` and `spatialReference.wkid`, or point with `x`, `y`, and `spatialReference`)",
    },
  },
  async run({ $ }) {
    const {
      arcgisOnline: app,
      mapTitle,
      targetLayerNames,
      geometry,
    } = this;

    if (!mapTitle) {
      throw new Error("mapTitle is required");
    }
    if (!targetLayerNames?.length) {
      throw new Error("targetLayerNames is required");
    }
    if (!geometry) {
      throw new Error("geometry is required");
    }

    const result = await app.queryIntersectingFeaturesByGeometry({
      $,
      mapTitle,
      boundary: geometry,
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
