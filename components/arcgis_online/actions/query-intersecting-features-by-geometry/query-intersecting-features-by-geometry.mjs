import arcgisOnline from "../../arcgis_online.app.mjs";

export default {
  key: "arcgis_online-query-intersecting-features-by-geometry",
  name: "Query Intersecting Features by Geometry",
  description:
    "Query layers in a hosted feature service (resolved by portal item title) for features whose geometry intersects a boundary you provide as [Esri JSON geometry](https://developers.arcgis.com/documentation/common-data-types/geometry-objects.htm) (`rings`, `paths`, or `x`/`y`, with `spatialReference.wkid`). Each target layer uses the [Feature Layer query](https://developers.arcgis.com/rest/services-reference/enterprise/query-feature-service-layer-.htm) operation with `spatialRel=esriSpatialRelIntersects`. Returns `{ geometryType, layers: { [layerName]: { count, features } } }` where `features` are attribute objects only (geometries are not returned)",
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
        "Title of the hosted Feature Service item in ArcGIS Online or Enterprise used to resolve the service URL",
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
        "Layer names in that service to query; each runs an intersect `query` against the same boundary",
    },
    geometry: {
      type: "object",
      label: "Geometry",
      description:
        "Esri JSON boundary as an object or JSON string. Points: `x` (longitude), `y` (latitude), and `spatialReference` with `wkid` or `latestWkid` (e.g. 4326 for WGS 84). Polygons use `rings`; polylines use `paths`",
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
